<script lang="ts">
	import { twMerge } from '$lib/utils/tw-merge';
	import { Tooltip } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';

	interface Props {
		trigger: Snippet;
		content?: Snippet;
		side?: 'bottom' | 'top' | 'right' | 'left';
		disabled?: boolean;
		triggerClasses?: string;
	}

	let { trigger, content, side, disabled, triggerClasses }: Props = $props();
</script>

<Tooltip.Root disableHoverableContent delayDuration={200} {disabled}>
	<Tooltip.Trigger>
		{#snippet child({ props })}
			<div {...props} class={twMerge('inline-flex h-fit w-fit', triggerClasses)}>
				{@render trigger()}
			</div>
		{/snippet}
	</Tooltip.Trigger>

	{#if content}
		<Tooltip.Portal>
			<Tooltip.Content forceMount sideOffset={5} {side}>
				{#snippet child({ wrapperProps, props, open })}
					{#if open}
						<div {...wrapperProps}>
							<div {...props} transition:fly class="z-50">
								<Tooltip.Arrow class="text-neutral-dark" />
								<div
									class="max-w-300 rounded-md bg-neutral-dark px-sm py-6 text-center typography-label-xs font-semibold text-text-base">
									{@render content()}
								</div>
							</div>
						</div>
					{/if}
				{/snippet}
			</Tooltip.Content>
		</Tooltip.Portal>
	{/if}
</Tooltip.Root>
