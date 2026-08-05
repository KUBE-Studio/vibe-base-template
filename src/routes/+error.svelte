<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/base';
	import { navigate } from '$lib/utils';

	const status = $derived(page.status);
	const message = $derived(page.error?.message ?? 'Ein unerwarteter Fehler ist aufgetreten.');

	function titleForStatus(status: number) {
		switch (status) {
			case 401:
				return 'Nicht angemeldet';
			case 403:
				return 'Kein Zugriff';
			case 404:
				return 'Nicht gefunden';
			case 500:
				return 'Serverfehler';
			default:
				return 'Fehler';
		}
	}

	const onBack = () => {
		if (history.length > 1) {
			history.back();
			return;
		}

		void navigate('/');
	};
</script>

<div class="z-1 flex min-h-screen flex-col items-center justify-center gap-3xl px-xl text-center text-text-strong">
	<img src="/images/logo.svg" alt="Logo" class="h-48 w-auto" />

	<div class="flex flex-col items-center gap-lg">
		<p class="typography-h2">{status} - {titleForStatus(status)}</p>
		<p class="typography-sm">{message}</p>
	</div>

	<Button element="button" title="Zurück" onclick={onBack} size="large" />
</div>
