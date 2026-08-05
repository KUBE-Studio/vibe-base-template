<script lang="ts">
	import type { Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	interface Props {
		class?: string;
		responsive?: boolean;
		minWidthClass?: string;
		wrapperClass?: string;
		children: Snippet;
	}

	let { class: className, responsive = false, minWidthClass, wrapperClass, children }: Props = $props();
</script>

{#if responsive}
	<div class={twMerge('thin-scrollbar overflow-x-auto overflow-y-hidden', wrapperClass)}>
		<table class={twMerge('relative z-10 min-w-full border-separate border-spacing-0', minWidthClass, className)}>
			{@render children()}
		</table>
	</div>
{:else}
	<table class={twMerge('relative z-10 min-w-full border-separate border-spacing-0', className)}>
		{@render children()}
	</table>
{/if}
