<script lang="ts">
	import { client } from '$lib/client';
	import { Button } from '$lib/components/base';
	import { TextInput } from '$lib/components/input';
	import AppPage from '$lib/components/layout/app-page.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	let newPassword = $state('');
	let confirmPassword = $state('');
	let loading = $state(false);
	let success = $state(false);
	let errorMessage = $state('');

	const onSubmit = async () => {
		if (loading) {
			return;
		}

		const token = data.token;

		if (!token) {
			errorMessage = 'Reset-Token fehlt oder ist ungültig.';
			return;
		}

		if (!newPassword || newPassword.length < 8) {
			errorMessage = 'Passwort muss mindestens 8 Zeichen lang sein.';
			return;
		}

		if (newPassword !== confirmPassword) {
			errorMessage = 'Passwörter stimmen nicht überein.';
			return;
		}

		loading = true;
		errorMessage = '';

		try {
			const result = await client.auth.resetPassword({
				token,
				newPassword
			});

			if (result.error) {
				void goto(resolve('/auth/forgot-password?reason=invalid-token'), { replaceState: true });
				return;
			}

			success = true;
		} catch (error) {
			console.error(error);
			errorMessage = 'Passwort konnte nicht zurückgesetzt werden.';
		} finally {
			loading = false;
		}
	};
	import { APP_NAME } from '$lib/config';
</script>

<svelte:head>
	<title>Passwort zurücksetzen – {APP_NAME}</title>
</svelte:head>

<AppPage>
	<div class="mx-auto flex w-full max-w-500 flex-col gap-xl">
		<div class="text-center">
			<h1 class="mb-sm typography-h4 font-semibold">Neues Passwort setzen</h1>
			<p class="typography-md text-text-sub">Setze ein neues Passwort fur deinen Account.</p>
		</div>

		{#if success}
			<p class="text-center typography-sm text-green-600">Passwort erfolgreich zurückgesetzt.</p>
			<p class="text-center typography-sm text-text-sub">
				Zurück zum <a class="text-text-primary" href={resolve('/auth/login')}>Login</a>
			</p>
		{:else}
			<div class="flex flex-col gap-sm">
				<TextInput id="new-password" type="password" label="Neues Passwort" bind:value={newPassword} />
				<TextInput id="confirm-password" type="password" label="Passwort wiederholen" bind:value={confirmPassword} />
				<Button element="button" title={loading ? 'Speichern...' : 'Passwort speichern'} onclick={onSubmit} disabled={loading} />
			</div>

			{#if errorMessage}
				<p class="text-center typography-sm text-error">{errorMessage}</p>
			{/if}
		{/if}
	</div>
</AppPage>
