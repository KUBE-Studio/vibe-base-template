<script lang="ts">
	import { Tabs } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	interface Props {
		value: string;
		children: Snippet;
		class?: string;
	}

	let { value = $bindable(), children, class: className }: Props = $props();
</script>

<Tabs.Root bind:value class={twMerge('', className)}>
	{@render children()}
</Tabs.Root>
