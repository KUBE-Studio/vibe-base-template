<script lang="ts">
	import { client } from '$lib/client';
	import { Button } from '$lib/components/base';
	import { TextInput } from '$lib/components/input';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	let email = $state('');
	let loading = $state(false);
	let done = $state(false);
	let failed = $state(false);
	const invalidLink = $derived(page.url.searchParams.get('reason') === 'invalid-token');

	const onSubmit = async () => {
		if (!email || loading) {
			return;
		}

		loading = true;
		failed = false;

		try {
			const result = await client.auth.requestPasswordReset({
				email,
				redirectTo: resolve('/auth/reset-password')
			});

			if (result.error) {
				failed = true;
				return;
			}

			done = true;
		} catch (error) {
			console.error(error);
			failed = true;
		} finally {
			loading = false;
		}
	};
	import { APP_NAME } from '$lib/config';
</script>

<svelte:head>
	<title>Passwort vergessen – {APP_NAME}</title>
</svelte:head>

<div class="relative flex h-full w-full flex-col items-center justify-center">
	<div class="flex w-full max-w-500 flex-col gap-xl">
		<div class="text-center">
			<h1 class="mb-sm typography-h4 font-semibold">Passwort vergessen</h1>
			<p class="typography-md text-text-sub">Wir schicken dir einen Link zum Zurücksetzen deines Passworts per E-Mail.</p>
		</div>

		{#if invalidLink}
			<p class="text-center typography-sm text-text-sub">
				Dein Reset-Link ist abgelaufen oder ungültig. Bitte fordere einen neuen Link an.
			</p>
		{/if}

		<div class="flex flex-col gap-sm">
			<TextInput id="forgot-password-email" type="email" label="E-Mail" placeholder="E-Mail" bind:value={email} />
			<Button element="button" title={loading ? 'Senden...' : 'Reset-Link senden'} onclick={onSubmit} disabled={loading} />
		</div>

		{#if done}
			<p class="text-center typography-sm text-text-sub">
				Falls ein Konto mit dieser E-Mail existiert, haben wir einen Link zum Zurücksetzen gesendet.
			</p>
		{/if}

		{#if failed}
			<p class="text-center typography-sm text-error">Reset-Link konnte nicht gesendet werden.</p>
		{/if}

		<p class="text-center typography-sm text-text-sub">
			Zurück zum
			<a class="text-text-primary" href={resolve('/auth/login')}>Login</a>
		</p>
	</div>
</div>
