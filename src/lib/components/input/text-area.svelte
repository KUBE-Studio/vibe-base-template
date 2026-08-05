<script lang="ts">
	import { twMerge } from '$lib/utils/tw-merge';
	import { InputWrapper, type InputSize } from '$lib/components/input';
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	type Props = Omit<HTMLTextareaAttributes, 'value' | 'class'> & {
		id: string;
		label?: string;
		errors?: string[];
		wrapperClass?: string;
		value?: string;
		class?: string;
		size?: InputSize;
	};

	let {
		id,
		label,
		value = $bindable(),
		rows = 5,
		errors,
		class: className,
		wrapperClass,
		required,
		size = 48,
		...restProps
	}: Props = $props();

	const sizeClasses: Record<InputSize, string> = {
		'36': 'typography-sm px-10 py-sm',
		'40': 'typography-sm p-10',
		'48': 'typography-md p-md'
	};
</script>

<InputWrapper {id} {label} {errors} {required} class={wrapperClass}>
	<textarea
		{id}
		bind:value
		{rows}
		data-error={errors !== undefined && errors.length > 0}
		{...restProps}
		class={twMerge(
			'disabled:placeholder:text-text-disabled relative z-0 w-full resize-y rounded-md border-0! bg-bg-base font-normal text-text-strong ring-1 ring-stroke-weak outline-3 outline-offset-1 outline-transparent transition-all duration-200 ease-in-out placeholder:text-text-soft hover:border-0 hover:ring-stroke-sub focus:border-0 focus:ring-stroke-sub focus:outline-stroke-weak disabled:cursor-not-allowed disabled:bg-neutral-light disabled:ring-stroke-weak data-[error=true]:text-error data-[error=true]:ring-error data-[error=true]:outline-error-light data-[error=true]:placeholder:text-error',
			sizeClasses[size],
			className
		)}></textarea>
</InputWrapper>
