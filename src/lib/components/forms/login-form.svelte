<script lang="ts">
	import { z } from 'zod';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { client } from '$lib/client';
	import { superForm } from 'sveltekit-superforms/client';
	import { TextInput } from '$lib/components/input';
	import { navigate } from '$lib/utils';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/base/button.svelte';

	interface Props {
		/** Whether Google login is configured on the server. */
		googleLogin: boolean;
	}

	let { googleLogin }: Props = $props();

	const schema = z.object({
		email: z.email('Bitte eine gültige E-Mail-Adresse eingeben'),
		password: z.string().min(1, 'Bitte Passwort eingeben')
	});

	const formData: z.infer<typeof schema> = {
		email: '',
		password: ''
	};

	let loginFailed = $state(false);
	let emailVerificationRequired = $state(false);

	const { form, enhance, errors } = superForm(formData, {
		SPA: true,
		validators: zod4(schema),
		taintedMessage: false,
		invalidateAll: false,
		onUpdated: async ({ form }) => {
			if (form.valid) {
				loginFailed = false;
				emailVerificationRequired = false;

				try {
					const result = await client.auth.signIn.email({
						email: form.data.email,
						password: form.data.password,
						callbackURL: '/'
					});

					if (result.error) {
						if (result.error.status === 403 && result.error.message === 'Email not verified') {
							emailVerificationRequired = true;
							return;
						}

						console.error(result.error);
						loginFailed = true;
						return;
					}

					await navigate('/');
				} catch (error) {
					console.error(error);
					loginFailed = true;
				}
			}
		}
	});

	const googleSignIn = () => {
		client.auth.signIn.social({
			provider: 'google',
			callbackURL: '/'
		});
	};
</script>

<form use:enhance class="mx-auto mt-2xl flex w-450 max-w-full flex-col gap-sm">
	{#if googleLogin}
		<Button element="button" onclick={googleSignIn} leftIcon="google" color="outline" title="Mit Google anmelden" />

		<div class="text-label flex items-center gap-md py-xs text-text-soft" aria-label="Alternative Login-Trennung">
			<div aria-hidden="true" class="my-lg w-full border-t border-neutral-200"></div>
			<span class="typography-2xs">oder</span>
			<div aria-hidden="true" class="my-lg w-full border-t border-neutral-200"></div>
		</div>
	{/if}

	<div class="flex flex-col gap-lg">
		<TextInput type="email" id="email" label="E-Mail" placeholder="E-Mail" bind:value={$form.email} errors={$errors.email} />
		<TextInput
			type="password"
			id="password"
			label="Passwort"
			placeholder="Passwort"
			bind:value={$form.password}
			errors={$errors.password} />
	</div>

	<div class="mt-6 text-left">
		<a href={resolve('/auth/forgot-password')} class="typography-sm text-text-primary hover:opacity-80">Passwort vergessen?</a>
	</div>

	{#if loginFailed}
		<p class="text-center text-sm text-error">Die eingegebenen Anmeldedaten sind nicht korrekt.</p>
	{/if}

	{#if emailVerificationRequired}
		<p class="text-center text-sm text-primary-600">
			Bitte bestätige deine E-Mail-Adresse. Wir haben dir erneut eine Bestätigungs-E-Mail gesendet.
		</p>
	{/if}

	<Button class="mt-2xl cursor-pointer" element="button" type="submit" title="Anmelden" />
</form>

<p class="mt-lg text-center typography-sm text-text-sub">
	Noch kein Account?
	<a href={resolve('/auth/register')} class="text-text-primary">Jetzt Registrieren</a>
</p>
