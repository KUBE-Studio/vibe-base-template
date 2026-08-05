<script lang="ts">
	import type { Snippet } from 'svelte';
	import { twMerge } from '$lib/utils/tw-merge';
	import { DropdownMenu } from 'bits-ui';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	type Props = DropdownMenu.RootProps & {
		trigger: Snippet;
		items: Snippet;
		class?: string;
		sameWidth?: boolean;
		align?: 'center' | 'end' | 'start';
	};

	let { open = $bindable(false), align = 'center', trigger, items, class: className, sameWidth = false, ...restProps }: Props = $props();
</script>

<DropdownMenu.Root bind:open {...restProps}>
	<DropdownMenu.Trigger class={className}>
		{@render trigger()}
	</DropdownMenu.Trigger>
	<DropdownMenu.Portal>
		<DropdownMenu.Content forceMount {align} sideOffset={8}>
			{#snippet child({ wrapperProps, props, open })}
				{#if open}
					<div {...wrapperProps}>
						<div
							{...props}
							transition:fly={{ delay: 0, duration: 500, easing: quintOut }}
							class={twMerge(
								'z-50 overflow-hidden rounded-md border border-stroke-weak bg-bg-base p-xs text-text-strong shadow-sm focus:outline-hidden',
								sameWidth ? 'w-(--bits-dropdown-menu-anchor-width)' : 'w-fit'
							)}>
							{@render items()}
						</div>
					</div>
				{/if}
			{/snippet}
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
