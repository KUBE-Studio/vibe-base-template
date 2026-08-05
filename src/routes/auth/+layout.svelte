<script lang="ts">
	import '$lib/styles/app.css';
	import AuthShowcase from '$lib/components/layout/auth-showcase.svelte';
	import { Toaster } from 'svelte-hot-french-toast';

	let { children } = $props();
</script>

<Toaster />

<div class="grid h-screen w-full gap-md overflow-hidden lg:grid-cols-[0.42fr_0.58fr] lg:p-md">
	<AuthShowcase />
	<div class="relative z-0 h-full min-h-0 w-full overflow-y-auto px-md py-3xl">
		{@render children()}
	</div>
</div>
