<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Label } from '$lib/components/input';
	import { twMerge } from '$lib/utils/tw-merge';

	interface Props {
		id: string;
		label?: string;
		errors?: string[];
		children: Snippet;
		class?: string;
		required?: boolean | null;
	}

	let { id, label, children, errors, class: className, required }: Props = $props();
</script>

<div class={twMerge('relative flex flex-col gap-6', className)}>
	{#if label}
		<Label htmlFor={id} {required}>
			{label}
		</Label>
	{/if}

	{@render children()}

	{#if errors && errors.length > 0}
		<p class="error typography-xs text-error">{errors.join(', ')}</p>
	{/if}
</div>
