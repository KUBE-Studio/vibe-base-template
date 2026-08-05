<script lang="ts">
	import { twMerge } from '$lib/utils/tw-merge';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children: Snippet;
	}

	let { class: className, children }: Props = $props();
</script>

<main class={twMerge('flex min-h-0 max-w-1600 flex-1 grow flex-col overflow-y-auto px-md py-md lg:px-xl lg:py-xl xl:px-120', className)}>
	{@render children()}
</main>
