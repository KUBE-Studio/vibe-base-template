<script lang="ts">
	import type { Snippet } from 'svelte';
	import { twMerge } from '$lib/utils/tw-merge';

	interface Props {
		children: Snippet;
		htmlFor: string;
		class?: string;
		required?: boolean | null;
	}

	let { children, htmlFor, class: className, required }: Props = $props();
</script>

<label for={htmlFor} class={twMerge('text-text w-fit typography-label-md font-semibold', className)}>
	{@render children()}

	{#if required}
		<span class="text-error"> *</span>
	{/if}
</label>
