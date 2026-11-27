<script lang="ts">
	import { resolve } from '$app/paths';
	import Button from '$lib/components/base/button.svelte';
	import { Icon } from '$lib/components/base/icons';
	import { client } from '$lib/client';

	interface PageData {
		email: string | null;
	}

	let { data }: { data: PageData } = $props();

	let isResending = $state(false);
	let resendSuccess = $state(false);
	let resendFailed = $state(false);

	const resendVerificationEmail = async () => {
		if (!data.email) {
			return;
		}

		isResending = true;
		resendFailed = false;

		const result = await client.auth.sendVerificationEmail({
			email: data.email,
			callbackURL: '/'
		});

		isResending = false;

		if (result.error) {
			resendFailed = true;
			return;
		}

		resendSuccess = true;
		setTimeout(() => {
			resendSuccess = false;
		}, 3000);
	};
	import { APP_NAME } from '$lib/config';
</script>

<svelte:head>
	<title>E-Mail prüfen – {APP_NAME}</title>
</svelte:head>

<div class="relative flex min-h-full w-full flex-col items-center justify-center">
	<div class="w-full max-w-500">
		<div class="text-center">
			<div class="mb-xl flex justify-center">
				<div class="rounded-xl bg-primary-100 p-md">
					<Icon name="mailbox" class="text-primary-900" size={32} />
				</div>
			</div>
			<h1 class="mb-lg typography-h4 font-semibold">E-Mail prüfen</h1>
			<p class="typography-md text-text-sub">
				Falls für diese E-Mail-Adresse eine Registrierung möglich oder bereits vorhanden ist, haben wir eine Bestätigungsmail an <strong>
					{data.email}
				</strong> versendet.
			</p>
		</div>

		<div class="mt-xl flex flex-col gap-lg">
			<div class="mt-xl flex flex-col gap-md">
				<div class="flex items-center justify-center gap-xs">
					<p class="typography-sm text-text-soft">Keine E-Mail erhalten?</p>
					<button
						disabled={isResending || resendSuccess}
						type="button"
						onclick={resendVerificationEmail}
						class="typography-sm text-text-primary hover:underline disabled:opacity-50">
						{resendSuccess ? 'Email versendet!' : isResending ? 'Wird versendet...' : 'E-Mail erneut versendet'}
					</button>
				</div>
				{#if resendFailed}
					<p class="text-center typography-sm text-error">Die E-Mail konnte nicht erneut versendet werden.</p>
				{/if}
			</div>

			<Button element="link" href={resolve('/auth/login')} title="Zum Login" />
		</div>
	</div>
</div>
