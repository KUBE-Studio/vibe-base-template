<script lang="ts">
	import { RegisterForm } from '$lib/components/forms';
	import { APP_NAME } from '$lib/config';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Registrieren – {APP_NAME}</title>
</svelte:head>

<div class="relative flex min-h-full w-full flex-col items-center justify-center">
	<div class="w-full max-w-500">
		<div class="text-center">
			<h1 class="mb-sm typography-h4 font-semibold">Erstelle einen Account</h1>
			<p class="typography-md text-text-sub">Registriere dich, um Zugang zu beantragen.</p>
		</div>
		<RegisterForm googleLogin={data.googleLogin} />
	</div>
</div>
