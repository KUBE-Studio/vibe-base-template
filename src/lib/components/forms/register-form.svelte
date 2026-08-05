<script lang="ts">
	import { z } from 'zod';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { client } from '$lib/client';
	import { superForm } from 'sveltekit-superforms/client';
	import { RegexCheck, TextInput } from '$lib/components/input';
	import { navigate } from '$lib/utils';
	import Button from '$lib/components/base/button.svelte';

	const schema = z.object({
		firstName: z.string().min(1, 'Bitte Vornamen eingeben'),
		lastName: z.string().min(1, 'Bitte Nachnamen eingeben'),
		email: z.email('Bitte eine gültige Email eingeben'),
		password: z.string().min(8, 'Passwort muss mindestens 8 Zeichen lang sein')
	});

	const formData: z.infer<typeof schema> = {
		firstName: '',
		lastName: '',
		email: '',
		password: ''
	};

	let registerFailed = $state(false);
	let emailAlreadyExists = $state(false);

	const sendVerificationEmailIfPending = async (email: string) => {
		try {
			const result = await client.api.registration.resendVerificationForExistingEmail.mutate({ email });

			if (result?.sent !== true) {
				return false;
			}

			const verificationResult = await client.auth.sendVerificationEmail({
				email,
				callbackURL: '/auth/login'
			});

			return !verificationResult.error;
		} catch (error) {
			console.error(error);

			return false;
		}
	};

	const passwordRegexInfo = [
		{ label: 'Mindestens 8 Zeichen', regex: /^.{8,}$/ },
		{ label: '1 Großbuchstabe', regex: /[A-Z]/ },
		{ label: '1 Kleinbuchstabe', regex: /[a-z]/ },
		{ label: '1 Zahl', regex: /\d/ }
	];

	const { form, enhance, errors } = superForm(formData, {
		SPA: true,
		validators: zod4(schema),
		taintedMessage: false,
		invalidateAll: false,
		onUpdated: async ({ form }) => {
			if (!form.valid) {
				return;
			}

			try {
				registerFailed = false;
				emailAlreadyExists = false;

				const restoredUser = await client.api.registration.restoreDeleted.mutate(form.data);

				if (restoredUser) {
					if (!(await sendVerificationEmailIfPending(form.data.email))) {
						registerFailed = true;
						return;
					}

					await navigate(`/auth/register/confirmation?email=${encodeURIComponent(form.data.email)}`);
					return;
				}

				const result = await client.auth.signUp.email({
					name: '',
					firstName: form.data.firstName,
					lastName: form.data.lastName,
					email: form.data.email,
					password: form.data.password,
					callbackURL: '/'
				});

				if (result.error) {
					if (!(await sendVerificationEmailIfPending(form.data.email))) {
						emailAlreadyExists = true;
						return;
					}

					await navigate(`/auth/register/confirmation?email=${encodeURIComponent(form.data.email)}`);
					return;
				}

				await navigate(`/auth/register/confirmation?email=${encodeURIComponent(form.data.email)}`);
			} catch (error) {
				console.error(error);

				if (!(await sendVerificationEmailIfPending(form.data.email))) {
					registerFailed = true;
					return;
				}

				await navigate(`/auth/register/confirmation?email=${encodeURIComponent(form.data.email)}`);
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
	<Button element="button" onclick={googleSignIn} leftIcon="google" color="outline" title="Mit Google anmelden" />

	<div class="text-label flex items-center gap-md py-xs text-text-soft" aria-label="Alternative Login-Trennung">
		<div aria-hidden="true" class="my-lg w-full border-t border-neutral-200"></div>
		<span class="typography-2xs">oder</span>
		<div aria-hidden="true" class="my-lg w-full border-t border-neutral-200"></div>
	</div>
	<div class="flex flex-col gap-lg">
		<div class="grid grid-cols-1 gap-lg sm:grid-cols-2">
			<TextInput
				type="text"
				id="firstName"
				label="Vorname"
				placeholder="Vorname"
				bind:value={$form.firstName}
				errors={$errors.firstName} />
			<TextInput
				type="text"
				id="lastName"
				label="Nachname"
				placeholder="Nachname"
				bind:value={$form.lastName}
				errors={$errors.lastName} />
		</div>

		<TextInput type="email" id="email" label="Email" placeholder="E-Mail" bind:value={$form.email} errors={$errors.email} />
		<TextInput
			type="password"
			id="password"
			label="Password"
			placeholder="Passwort"
			bind:value={$form.password}
			errors={$errors.password} />
	</div>
	<RegexCheck string={$form.password} regexInfo={passwordRegexInfo} wrapperClass="mt-xs" />

	{#if registerFailed}
		<p class="mt-lg text-center text-sm text-error">Registrierung fehlgeschlagen.</p>
	{/if}
	{#if emailAlreadyExists}
		<p class="mt-lg text-center text-sm text-error">Diese E-Mail-Adresse ist bereits registriert. Bitte melde dich an.</p>
	{/if}

	<Button class="mt-2xl" element="button" title="Registrieren" type="submit" />
</form>

<p class="mt-lg text-center typography-sm text-text-sub">
	Bereits einen Account?
	<a href="/auth/login" class="text-text-primary">Zum Login</a>
</p>
