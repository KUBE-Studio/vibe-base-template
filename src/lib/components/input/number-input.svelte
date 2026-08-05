<script lang="ts">
	import { TextInput, InputWrapper, type InputSize } from '$lib/components/input';
	import { twMerge } from '$lib/utils/tw-merge';
	import type { RegisteredIconNames } from '$lib/components/base/icons';

	interface Props {
		id: string;
		value: number | undefined;
		disabled?: boolean;
		placeholder?: string;
		label?: string;
		errors?: string[];
		class?: string;
		format?: Intl.NumberFormat | null;
		onValueChange?: (value?: number) => void;
		required?: boolean;
		leftIcon?: RegisteredIconNames;
		leftIconClasses?: string;
		rightIcon?: RegisteredIconNames;
		rightIconClasses?: string;
		size?: InputSize;
	}

	let {
		id,
		value = $bindable(),
		disabled,
		placeholder,
		errors,
		label,
		class: className,
		format = new Intl.NumberFormat('de'),
		onValueChange,
		required,
		size = 48,
		...iconProps
	}: Props = $props();

	let valueFormatted: number | string | null | undefined = $derived(value && format ? format.format(value) : value);

	// filter out all non-number inputs
	const onKeyDown = (e: KeyboardEvent) => {
		const allowedKeys = ['Backspace', '.', ',', '-', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Delete', 'Home', 'End'];

		const currentValue = (e.currentTarget as HTMLInputElement).value;

		if (
			(isNaN(parseInt(e.key)) && !allowedKeys.includes(e.key) && !e.metaKey && !e.ctrlKey) ||
			(e.key === ',' && currentValue?.toString().includes(',')) ||
			(e.key === '-' && currentValue?.toString().includes('-'))
		) {
			e.stopPropagation();
			e.preventDefault();
		}
	};

	const onBlur = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		let newValue = e.currentTarget.value;

		if (newValue === '' || newValue === '-') {
			value = undefined;
		} else {
			const delocalisedValue = newValue.replaceAll('.', '').replaceAll(',', '.');
			value = Number(delocalisedValue);
		}

		if (onValueChange) {
			onValueChange(value);
		}
	};
</script>

<InputWrapper {id} {label} {errors} {required}>
	<TextInput
		{id}
		value={valueFormatted}
		{disabled}
		{placeholder}
		type="text"
		onkeydown={onKeyDown}
		onblur={onBlur}
		inputmode="numeric"
		{required}
		{size}
		class={twMerge('relative z-10 [&::-webkit-inner-spin-button]:hidden', className)}
		{...iconProps} />
</InputWrapper>
