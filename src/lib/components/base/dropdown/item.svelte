<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { twMerge } from '$lib/utils/tw-merge';

	type Props = {
		id: string;
		children: Snippet;
		class?: string;
		disabled?: boolean;
		onSelect?: (e: Event) => void;
	};

	let { id, children, class: className, disabled, onSelect }: Props = $props();
</script>

<DropdownMenu.Item
	{id}
	{disabled}
	{onSelect}
	class={twMerge(
		'flex cursor-pointer items-center gap-md rounded-sm bg-transparent px-10 py-6 typography-label-xs transition-colors hover:bg-neutral-lighter data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:hover:bg-transparent',
		className
	)}>
	{@render children()}
</DropdownMenu.Item>
