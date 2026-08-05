<script lang="ts">
	import { Tabs } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	interface Props {
		children: Snippet;
		value: string;
		class?: string;
	}

	let { children, value, class: className }: Props = $props();
</script>

<Tabs.Content {value} class={twMerge('', className)}>
	{@render children()}
</Tabs.Content>
