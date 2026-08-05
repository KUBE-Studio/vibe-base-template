<script lang="ts">
	import { twMerge } from '$lib/utils/tw-merge';
	import type { Snippet } from 'svelte';

	type Color = 'strong' | 'soft' | 'error' | 'primary';
	type Size = 'small' | 'medium';

	interface Props {
		children: Snippet;
		class?: string;
		color?: Color;
		size?: Size;
		style?: string;
	}

	let { children, class: className, color = 'strong', size = 'small', style }: Props = $props();

	let colorClasses: Record<Color, string> = {
		strong: 'bg-bg-strong text-text-base',
		soft: 'bg-neutral-100 text-text-sub',
		error: 'bg-error text-text-base',
		primary: 'bg-primary text-text-base'
	};

	let sizeClasses: Record<Size, string> = {
		small: 'text-11 leading-12 rounded-full',
		medium: 'typography-xs rounded-sm'
	};
</script>

<div
	{style}
	class={twMerge(
		'flex h-fit w-fit items-center gap-xs rounded-full px-sm py-xxs font-medium whitespace-nowrap transition-colors duration-200 ease-out',
		colorClasses[color],
		sizeClasses[size],
		className
	)}>
	{@render children()}
</div>
