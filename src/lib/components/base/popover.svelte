<script lang="ts">
	import { twMerge } from '$lib/utils/tw-merge';
	import { Popover } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';

	interface Props {
		trigger: Snippet;
		content?: Snippet;
		side?: 'bottom' | 'top' | 'right' | 'left';
		align?: 'start' | 'center' | 'end';
		triggerClasses?: string;
		openOnHover?: boolean;
	}

	let { trigger, content, side, triggerClasses, openOnHover = false, align = 'center' }: Props = $props();
</script>

<Popover.Root>
	<Popover.Trigger {openOnHover} openDelay={100}>
		{#snippet child({ props })}
			<div {...props} class={twMerge('inline-flex h-fit w-fit', triggerClasses)}>
				{@render trigger()}
			</div>
		{/snippet}
	</Popover.Trigger>

	{#if content}
		<Popover.Portal>
			<Popover.Content forceMount sideOffset={8} {side} {align}>
				{#snippet child({ wrapperProps, props, open })}
					{#if open}
						<div {...wrapperProps}>
							<div {...props} transition:fly class="z-50">
								<div
									class="text-text thin-scrollbar relative z-50 max-h-300 max-w-300 overflow-y-auto rounded-md border border-stroke-weak bg-bg-base p-lg text-text-strong outline-hidden">
									{@render content()}
								</div>
							</div>
						</div>
					{/if}
				{/snippet}
			</Popover.Content>
		</Popover.Portal>
	{/if}
</Popover.Root>
