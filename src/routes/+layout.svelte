<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import '$lib/styles/app.css';
	import { previousUrl } from '$lib/stores/navigation';
	import { Toaster } from 'svelte-hot-french-toast';
	import favicon from '$lib/assets/favicon.svg';
	import { Tooltip } from 'bits-ui';
	import { APP_DESCRIPTION, APP_NAME } from '$lib/config';

	let { children } = $props();

	afterNavigate(({ from }) => {
		previousUrl.set(from?.url ? `${from.url.pathname}${from.url.search}${from.url.hash}` : null);
	});
</script>

<svelte:head>
	<title>{APP_NAME}</title>
	<meta name="description" content={APP_DESCRIPTION} />
	<meta name="robots" content="index, follow" />
	<meta name="theme-color" content="#ffffff" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={APP_NAME} />
	<meta property="og:description" content={APP_DESCRIPTION} />
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster />

<Tooltip.Provider skipDelayDuration={0}>
	<div class="h-full w-full bg-bg-weak text-text-strong">
		{@render children()}
	</div>
</Tooltip.Provider>
