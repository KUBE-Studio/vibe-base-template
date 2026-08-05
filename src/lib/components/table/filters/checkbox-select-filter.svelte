<script lang="ts">
	import { Select, type WithoutChildren } from 'bits-ui';
	import { fly } from 'svelte/transition';
	import { twMerge } from '$lib/utils/tw-merge';
	import Button from '$lib/components/base/button.svelte';
	import { Checkbox } from '$lib/components/input';
	import type { RegisteredIconNames } from '$lib/components/base/icons';

	type Props = WithoutChildren<Select.RootProps> & {
		id: string;
		title: string;
		icon?: RegisteredIconNames;
		items: { label: string; value: string }[];
		disabled?: boolean;
		triggerClass?: string;
	};

	let { id, items, value = $bindable(), disabled = false, triggerClass, title, icon, ...restProps }: Props = $props();

	let selectedCount = $derived(value ? (restProps.type === 'multiple' ? value.length : 1) : 0);
</script>

<Select.Root {items} {disabled} allowDeselect bind:value={value as never} {...restProps}>
	<Select.Trigger {id} class={twMerge(' group/trigger', triggerClass)}>
		<Button
			element="div"
			title={`${title}${selectedCount > 0 ? ` (${selectedCount})` : ''}`}
			class="whitespace-nowrap"
			color="outline"
			leftIcon={icon} />
	</Select.Trigger>
	<Select.Portal>
		<Select.Content forceMount sideOffset={8} align="start">
			{#snippet child({ wrapperProps, props, open })}
				{#if open}
					<div {...wrapperProps}>
						<div
							{...props}
							transition:fly
							class={twMerge(
								'thin-scrollbar relative z-50 max-h-300 overflow-y-auto rounded-md border border-stroke-weak bg-bg-base p-sm typography-md text-text-strong shadow-2xl outline-hidden'
							)}>
							{#each items as item (item.value)}
								<Select.Item
									class="flex cursor-pointer items-center gap-6 rounded-sm bg-transparent px-md py-6 transition-colors hover:bg-neutral-lighter data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:hover:bg-transparent"
									{...item}>
									{#snippet children({ selected })}
										<Checkbox id={`${id}-${item.value}`} checked={selected} interactive={false}>
											{item.label}
										</Checkbox>
									{/snippet}
								</Select.Item>
							{/each}
						</div>
					</div>
				{/if}
			{/snippet}
		</Select.Content>
	</Select.Portal>
</Select.Root>
