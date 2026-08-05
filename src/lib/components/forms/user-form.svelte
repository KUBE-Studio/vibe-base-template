<script lang="ts" module>
	const schema = z.object({
		firstName: z.string().trim().min(1, 'Pflichtfeld.').max(100, 'Maximal 100 Zeichen.'),
		lastName: z.string().trim().min(1, 'Pflichtfeld.').max(100, 'Maximal 100 Zeichen.'),
		companyName: z.string().trim().max(200, 'Maximal 200 Zeichen.')
	});

	export type UserFormData = z.infer<typeof schema>;
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { z } from 'zod';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';
	import { Button } from '$lib/components/base';
	import { TextInput } from '$lib/components/input';
	import type { User } from '$lib/types';

	interface Props {
		input: User;
		onSubmit: (formData: UserFormData) => Promise<void> | void;
	}

	let { input, onSubmit }: Props = $props();

	function toFormData(user: User): UserFormData {
		return {
			firstName: user.firstName,
			lastName: user.lastName,
			companyName: user.companyName ?? ''
		};
	}

	const formData = untrack(() => toFormData(input));

	const { form, enhance, errors, allErrors, submitting, reset } = superForm(formData, {
		SPA: true,
		validators: zod4(schema),
		taintedMessage: false,
		invalidateAll: false,
		resetForm: false,
		onUpdated: async ({ form: result }) => {
			if (!result.valid) {
				return;
			}

			await onSubmit(result.data);
		}
	});

	// Re-seed from props so an `invalidateAll()` elsewhere doesn't leave the form
	// showing stale values.
	$effect(() => {
		const inputFormData = toFormData(input);

		reset({ data: inputFormData, newState: inputFormData });
	});

	let formValid = $derived($allErrors.length === 0);
</script>

<form use:enhance class="flex flex-col gap-xl overflow-hidden rounded-md border border-stroke-weak bg-bg-base p-xl">
	<div class="flex flex-col gap-lg">
		<div class="flex flex-col gap-xs">
			<h3 class="typography-label-lg font-semibold text-text-strong">Profil</h3>
			<p class="typography-sm text-text-sub">Deine persönlichen Angaben.</p>
		</div>

		<div class="grid gap-md md:grid-cols-2">
			<TextInput id="first-name" required label="Vorname" bind:value={$form.firstName} errors={$errors.firstName} />
			<TextInput id="last-name" required label="Nachname" bind:value={$form.lastName} errors={$errors.lastName} />
			<TextInput id="company-name" label="Unternehmen" bind:value={$form.companyName} errors={$errors.companyName} />
		</div>
	</div>

	<Button
		element="button"
		color="secondary"
		title={$submitting ? 'Speichern...' : 'Speichern'}
		type="submit"
		disabled={!formValid || $submitting}
		class="ml-auto w-fit" />
</form>
