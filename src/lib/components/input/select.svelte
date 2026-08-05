<script
	lang="ts"
	generics="Item extends { label: string; value: string; disabled?: boolean } = { label: string; value: string; disabled?: boolean }">
	import { Select, type WithoutChildren } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';
	import { InputWrapper, type InputSize } from '$lib/components/input';
	import { Icon } from '$lib/components/base/icons';
	import { twMerge } from '$lib/utils/tw-merge';

	type Props = WithoutChildren<Select.RootProps> & {
		id: string;
		placeholder?: string;
		label?: string;
		items: Item[];
		errors?: string[];
		disabled?: boolean;
		triggerClass?: string;
		wrapperClass?: string;
		sameWidth?: boolean;
		size?: InputSize;
		itemContent?: Snippet<[Item, boolean]>;
	};

	let {
		id,
		placeholder = 'Auswählen ...',
		label,
		items,
		value = $bindable(),
		errors,
		disabled = false,
		triggerClass,
		wrapperClass,
		sameWidth = true,
		required,
		size = 48,
		itemContent,
		...restProps
	}: Props = $props();

	let selected = $derived(items.filter((item) => (restProps.type === 'single' ? item.value === value : value?.includes(item.value))));

	const sizeClasses: Record<InputSize, string> = {
		'36': 'typography-sm px-10 py-sm max-h-36 gap-6',
		'40': 'typography-sm p-10 max-h-40 gap-6',
		'48': 'typography-md p-md max-h-48 gap-sm'
	};
</script>

<InputWrapper {id} {label} {errors} {required} class={wrapperClass}>
	<Select.Root {items} {disabled} bind:value={value as never} {required} {...restProps}>
		<Select.Trigger
			{id}
			data-error={errors !== undefined && errors.length > 0}
			class={twMerge(
				'focus:ring-neutral-strong group/trigger inline-flex w-full items-center rounded-md bg-bg-base text-left  text-text-strong ring-1 ring-stroke-weak outline-3 outline-transparent transition-all duration-200 ease-in-out hover:ring-stroke-sub focus:ring-stroke-sub focus:outline-neutral-lighter disabled:cursor-not-allowed data-[error=true]:text-error data-[error=true]:ring-error data-[error=true]:outline-neutral-lighter',
				sizeClasses[size],
				triggerClass
			)}>
			<p>
				{#if selected.length > 1}
					{selected.length} ausgewählt
				{:else if selected.length > 0}
					{selected[0].label}
				{:else}
					<span class="font-normal text-text-soft group-disabled/trigger:text-slate-800 group-data-[error=true]:text-error"
						>{placeholder || ''}</span>
				{/if}
			</p>

			<Icon name="chevron-down" class="ml-auto text-icon-sub" />
		</Select.Trigger>
		<Select.Portal>
			<Select.Content forceMount sideOffset={3} align="start">
				{#snippet child({ wrapperProps, props, open })}
					{#if open}
						<div {...wrapperProps}>
							<div
								{...props}
								transition:fly
								class={twMerge(
									'thin-scrollbar relative z-50 max-h-300 overflow-y-auto rounded-md  border border-stroke-weak bg-bg-base p-sm typography-md text-text-strong shadow-2xl outline-hidden',
									sameWidth ? 'w-(--bits-select-anchor-width)' : 'min-w-(--bits-select-anchor-width)'
								)}>
								{#each items as item (item.value)}
									<Select.Item
										class="flex cursor-pointer items-center gap-6 rounded-sm bg-transparent px-10 py-6 transition-colors hover:bg-neutral-lighter data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:hover:bg-transparent"
										{...item}>
										{#snippet children({ selected })}
											{#if itemContent}
												{@render itemContent(item, selected)}
											{:else}
												{item.label}
												{#if selected}
													<div class="ml-auto w-lg">
														<Icon name="check" size={18} />
													</div>
												{/if}
											{/if}
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
</InputWrapper>
