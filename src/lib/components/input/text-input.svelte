<script lang="ts">
	import { twMerge } from '$lib/utils/tw-merge';
	import { InputWrapper, type InputSize } from '$lib/components/input';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Icon, type RegisteredIconNames } from '$lib/components/base/icons';

	type Props = HTMLInputAttributes & {
		id: string;
		class?: string;
		label?: string;
		errors?: string[];
		wrapperClass?: string;
		required?: boolean;
		leftIcon?: RegisteredIconNames;
		leftIconClasses?: string;
		rightIcon?: RegisteredIconNames;
		rightIconClasses?: string;
		size?: InputSize;
	};

	let {
		id,
		label,
		errors,
		class: className,
		value = $bindable(),
		wrapperClass,
		required,
		leftIcon,
		leftIconClasses = '',
		rightIcon,
		rightIconClasses = '',
		size = 48,
		...restProps
	}: Props = $props();

	const sizeClasses: Record<InputSize, string> = {
		'36': 'typography-sm px-10 py-sm max-h-36 gap-6',
		'40': 'typography-sm p-10 max-h-40 gap-6',
		'48': 'typography-md p-md max-h-48 gap-sm'
	};
</script>

<InputWrapper {id} {label} {errors} {required} class={wrapperClass}>
	<div class="relative z-0">
		<input
			{id}
			bind:value
			{...restProps}
			data-error={errors !== undefined && errors.length > 0}
			class={twMerge(
				`disabled:placeholder:text-text-disabled relative z-0 w-full rounded-md border-0! font-normal text-text-strong  ring-1 ring-stroke-weak outline-3 outline-offset-1 outline-transparent transition-all duration-200 ease-in-out placeholder:text-text-soft hover:border-0 hover:ring-stroke-sub focus:border-0 focus:ring-stroke-sub focus:outline-stroke-weak disabled:cursor-not-allowed disabled:bg-neutral-light disabled:ring-stroke-weak data-[error=true]:text-error data-[error=true]:ring-error data-[error=true]:outline-error-light data-[error=true]:placeholder:text-error ${leftIcon ? 'pl-35!' : ''}`,
				sizeClasses[size],
				className
			)} />
		{#if leftIcon}
			<div
				class="pointer-events-none absolute top-0 left-0 z-10 flex aspect-square h-full items-center justify-center typography-sm text-text-soft">
				<Icon name={leftIcon} size={18} class={leftIconClasses} />
			</div>
		{/if}

		{#if rightIcon}
			<div
				class="pointer-events-none absolute top-0 right-0 z-10 flex aspect-square h-full items-center justify-center typography-sm text-text-soft">
				<Icon name={rightIcon} size={18} class={rightIconClasses} />
			</div>
		{/if}
	</div>
</InputWrapper>
