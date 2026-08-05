<script lang="ts">
	import { Checkbox, Label } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { twMerge } from '$lib/utils/tw-merge';
	import { InputWrapper } from '$lib/components/input';
	import { Icon } from '$lib/components/base/icons';

	type Props = {
		id: string;
		checked: boolean | undefined;
		errors?: string[];
		containerClass?: string;
		checkboxClass?: string;
		wrapperClass?: string;
		children: Snippet;
		disabled?: boolean;
		interactive?: boolean;
		onCheckedChange?: (v: boolean) => void;
		required?: boolean;
	};

	let {
		id,
		children,
		checked = $bindable(),
		disabled = false,
		errors,
		checkboxClass,
		containerClass,
		interactive = true,
		onCheckedChange,
		required,
		wrapperClass
	}: Props = $props();

	let checkboxStyle = $derived(
		twMerge(
			`peer size-14 min-w-14 rounded-3 ring-1 bg-bg-base data-[state=checked]:bg-primary data-[state=unchecked]:ring-stroke-weak hover:brightness-110 data-[state=unchecked]:focus:ring-stroke-sub outline-transparent outline-3 focus:outline-stroke-weak data-[state=checked]:ring-primary cursor-pointer active:scale-110 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:data-[state=checked]:bg-primary-disabled disabled:data-[state=checked]:ring-icon-strong text-text-base data-[error=true]:rings-error data-[error=true]:data-[state=checked]:bg-error data-[error=true]:focus:outline-red-300 mt-1.5 outline-offset-1`,
			checkboxClass
		)
	);
</script>

<InputWrapper {id} {errors} {required} class={wrapperClass}>
	<div class={twMerge('flex items-start gap-sm', containerClass)}>
		{#if interactive}
			<Checkbox.Root
				{id}
				{disabled}
				{onCheckedChange}
				{required}
				data-error={errors !== undefined && errors.length > 0}
				class={checkboxStyle}
				bind:checked>
				{#snippet children({ checked: isChecked })}
					<div class="-m-1 flex items-center justify-center">
						{#if isChecked}
							<Icon name="check" size={13} class="text-icon-base" />
						{/if}
					</div>
				{/snippet}
			</Checkbox.Root>
			<Label.Root
				for={id}
				class="max-w-fit min-w-0 shrink grow cursor-pointer typography-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
				{@render children()}
			</Label.Root>
		{:else}
			<div
				{id}
				aria-hidden="true"
				data-error={errors !== undefined && errors.length > 0}
				data-state={checked ? 'checked' : 'unchecked'}
				class={twMerge(checkboxStyle, 'cursor-pointer active:scale-100')}>
				<span class="-m-1 flex items-center justify-center">
					{#if checked}
						<Icon name="check" size={13} class="text-icon-base" />
					{/if}
				</span>
			</div>
			<span class="max-w-fit min-w-0 shrink grow cursor-pointer typography-sm">
				{@render children()}
			</span>
		{/if}
	</div>
</InputWrapper>
