<script lang="ts">
	import type { Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	interface Props {
		children: Snippet;
		class?: string;
	}

	let { children, class: className }: Props = $props();
</script>

<thead class={twMerge('group/head relative z-0 bg-neutral/7', className)}>
	{@render children()}
</thead>
