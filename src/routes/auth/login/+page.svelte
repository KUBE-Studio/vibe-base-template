<script lang="ts">
	import { LoginForm } from '$lib/components/forms';
	import { APP_NAME } from '$lib/config';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Login – {APP_NAME}</title>
</svelte:head>

<div class="relative flex h-full w-full flex-col items-center justify-center">
	<div class="w-full max-w-500">
		<div class="text-center">
			<h1 class="mb-sm typography-h4 font-semibold">Willkommen zurück!</h1>
			<p class="typography-md text-text-sub">Melde dich an, um fortzufahren.</p>
		</div>

		<LoginForm googleLogin={data.googleLogin} />
	</div>
</div>
