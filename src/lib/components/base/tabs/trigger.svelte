<script lang="ts">
	import { Tabs } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { twMerge } from '$lib/utils/tw-merge';

	interface Props {
		children: Snippet;
		value: string;
		class?: string;
		onClick?: (e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) => void;
	}

	let { children, value, class: className, onClick }: Props = $props();
</script>

<Tabs.Trigger
	{value}
	onclick={onClick}
	class={twMerge(
		'flex items-center gap-6 border border-r border-stroke-weak bg-transparent px-lg py-sm typography-label-md font-semibold text-text-sub transition-colors duration-100 ease-out data-[state=active]:bg-bg-soft data-[state=active]:text-text-strong lg:px-xl ',
		className
	)}>
	{@render children()}
</Tabs.Trigger>
