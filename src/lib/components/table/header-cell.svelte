<script lang="ts">
	import type { Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	interface Props {
		class?: string;
		children: Snippet;
	}

	let { class: className, children }: Props = $props();
</script>

<th scope="col" class={twMerge('px-lg py-md typography-xs font-normal text-text-sub', className)}>
	{@render children()}
</th>
