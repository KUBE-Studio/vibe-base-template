<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import { Tabs } from '$lib/components/base/tabs';
	import { twMerge } from '$lib/utils/tw-merge';
	import TextArea from './text-area.svelte';
	import { InputWrapper, type InputSize } from '.';
	import Markdown from '$lib/components/markdown.svelte';

	type Props = Omit<HTMLTextareaAttributes, 'value' | 'class'> & {
		id: string;
		class?: string;
		label?: string;
		errors?: string[];
		wrapperClass?: string;
		required?: boolean;
		size?: InputSize;
		previewClass?: string;
		value?: string | null;
	};

	let {
		id,
		label,
		required,
		value = $bindable(),
		errors,
		class: className,
		size = 48,
		wrapperClass,
		previewClass,
		rows = 8,
		...restProps
	}: Props = $props();

	const textAreaValue = $derived(value ?? '');

	type ActiveTab = 'write' | 'preview';

	const tabs: Record<ActiveTab, { id: ActiveTab; label: string }> = {
		write: { id: 'write', label: 'Markdown' },
		preview: { id: 'preview', label: 'Vorschau' }
	} as const;

	let activeTabId: ActiveTab = $state(tabs.write.id);
</script>

<InputWrapper {id} {required} {errors} {label} class={wrapperClass}>
	<Tabs.Root bind:value={activeTabId}>
		<Tabs.List>
			{#each Object.values(tabs) as tab (tab.id)}
				<Tabs.Trigger value={tab.id}>{tab.label}</Tabs.Trigger>
			{/each}
		</Tabs.List>

		<div class="mt-sm">
			<Tabs.Content value={tabs.write.id}>
				<TextArea
					{id}
					{required}
					value={textAreaValue}
					oninput={(event) => (value = event.currentTarget.value)}
					class={className}
					{size}
					{rows}
					{...restProps} />
			</Tabs.Content>

			<Tabs.Content value={tabs.preview.id}>
				<div
					class={twMerge(
						'min-h-220 rounded-md p-md ring-1 ring-stroke-weak',
						errors !== undefined && errors.length > 0 && 'ring-error outline-3 outline-offset-1 outline-error-light',
						previewClass
					)}>
					{#if String(value ?? '').trim()}
						<Markdown markdown={String(value)} />
					{:else}
						<p class="text-center typography-sm text-text-soft italic">Keine Vorschau verfügbar.</p>
					{/if}
				</div>
			</Tabs.Content>
		</div>
	</Tabs.Root>
</InputWrapper>
