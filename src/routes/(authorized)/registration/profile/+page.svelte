<script lang="ts">
	import { z } from 'zod';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';
	import { client } from '$lib/client';
	import { TextInput } from '$lib/components/input';
	import { navigate } from '$lib/utils';
	import { Button } from '$lib/components/base';
	import { Icon } from '$lib/components/base/icons';
	import { APP_NAME } from '$lib/config';

	const schema = z.object({
		companyName: z.string().trim().max(200)
	});

	const formData: z.infer<typeof schema> = {
		companyName: ''
	};

	let submitFailed = $state(false);

	const { form, enhance, errors, allErrors } = superForm(formData, {
		SPA: true,
		validators: zod4(schema),
		taintedMessage: false,
		invalidateAll: false,
		onUpdated: async ({ form }) => {
			if (!form.valid) {
				return;
			}

			submitFailed = false;

			try {
				await client.api.registration.completeProfile.mutate(form.data);
				await navigate('/registration/pending');
			} catch (error) {
				console.error(error);
				submitFailed = true;
			}
		}
	});

	let formValid = $derived($allErrors.length === 0);
</script>

<svelte:head>
	<title>Registrierung abschließen – {APP_NAME}</title>
</svelte:head>

<div class="relative flex min-h-screen w-full items-center justify-center p-lg">
	<div class="w-full max-w-500">
		<div class="mb-xl flex justify-center">
			<div class="rounded-16 bg-blue-100 p-md">
				<Icon name="user-round-check" class="text-blue-900" size={32} />
			</div>
		</div>

		<div class="mb-xl text-center">
			<h1 class="mb-sm typography-h4 font-semibold">Registrierung abschließen</h1>
			<p class="typography-md text-text-sub">Ergänze deine Angaben. Danach wird dein Zugang durch einen Admin geprüft.</p>
		</div>

		<form use:enhance class="mt-xl flex flex-col gap-md">
			<TextInput id="company-name" label="Unternehmen" bind:value={$form.companyName} errors={$errors.companyName} />

			{#if submitFailed}
				<p class="text-center typography-sm text-error">Die Registrierung konnte nicht abgeschlossen werden.</p>
			{/if}

			<Button element="button" title="Registrierung finalisieren" type="submit" disabled={!formValid} />
		</form>
	</div>
</div>
