<script lang="ts">
	import { Tabs } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { twMerge } from '$lib/utils/tw-merge';

	interface Props {
		children: Snippet;
		class?: string;
	}

	let { children, class: className }: Props = $props();
</script>

<Tabs.List
	class={twMerge(
		'flex w-fit max-w-full scrollbar-none items-center overflow-hidden overflow-x-auto *:data-value:border-r-0 [&>*_[data-value]]:border-r-0 [&>*:first-child_[data-value]]:rounded-l-md [&>*:last-child_[data-value]]:rounded-r-md [&>*:last-child_[data-value]]:border-r [&>[data-value]:first-child]:rounded-l-md [&>[data-value]:last-child]:rounded-r-md [&>[data-value]:last-child]:border-r',
		className
	)}>
	{@render children()}
</Tabs.List>
