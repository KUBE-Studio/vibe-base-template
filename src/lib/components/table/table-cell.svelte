<script lang="ts">
	import type { Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	interface Props {
		children: Snippet;
		colspan?: number;
		class?: string;
		style?: string;
		onClick?: (
			e: MouseEvent & {
				currentTarget: EventTarget & HTMLElement;
			}
		) => void;
	}

	let { children, colspan = 1, class: className, style, onClick }: Props = $props();
</script>

<td onclick={onClick} {colspan} {style} class={twMerge('z-0 px-sm py-md typography-sm md:px-lg', className)}>
	{@render children()}
</td>
