<script lang="ts">
	import type { Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	interface Props {
		children: Snippet;
		class?: string;
		onClick?: () => void;
	}

	let { children, class: className, onClick }: Props = $props();
</script>

<tr
	onclick={onClick}
	class={twMerge(
		`group/row relative z-0 odd:bg-transparent  even:bg-neutral/7 hover:after:brightness-110! ${onClick ? 'cursor-pointer' : ''}`,
		className
	)}>
	{@render children()}
</tr>
