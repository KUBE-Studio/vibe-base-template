<script lang="ts" module>
	export type ButtonColor = 'primary' | 'secondary' | 'outline' | 'none' | 'error';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { Icon, type RegisteredIconNames } from './icons';
	import { twMerge } from '$lib/utils/tw-merge';
	import { slide } from 'svelte/transition';

	type Size = 'large' | 'medium' | 'small' | 'mini';

	type Props = {
		title: string;
		class?: string;
		children?: Snippet;
		size?: Size;
		color?: ButtonColor;
		iconOnly?: boolean;
		leftIcon?: RegisteredIconNames;
		rightIcon?: RegisteredIconNames;
		leftIconClasses?: string;
		rightIconClasses?: string;
	};

	type ButtonProps = Props &
		HTMLButtonAttributes & {
			element: 'button';
		};

	type LinkProps = Props &
		HTMLAnchorAttributes & {
			element: 'link';
			disabled?: boolean;
		};

	type DivProps = Props &
		HTMLAttributes<HTMLDivElement> & {
			element: 'div';
			disabled?: boolean;
		};

	let {
		title,
		children,
		class: className = '',
		size = 'medium',
		color = 'secondary',
		element = 'button',
		iconOnly = false,
		leftIcon,
		rightIcon,
		leftIconClasses = '',
		rightIconClasses = '',
		...restProps
	}: ButtonProps | LinkProps | DivProps = $props();

	const sizeClasses: Record<Size, string> = $derived({
		mini: `typography-label-xs font-semibold rounded-6 gap-6 ${iconOnly ? 'p-4' : 'px-sm py-3'}`,
		small: `typography-sm font-semibold rounded-md gap-6 ${iconOnly ? 'p-7' : 'px-md py-6'}`,
		medium: `typography-label-md font-semibold rounded-md gap-sm ${iconOnly ? 'p-8' : 'px-lg py-sm'}`,
		large: `typography-label-md font-semibold rounded-md gap-sm ${iconOnly ? 'p-10' : 'px-xl py-10'}`
	});

	const colorClasses: Record<ButtonColor, string> = {
		primary:
			'bg-primary text-text-base hover:bg-primary-hover active:bg-primary-hover group-data-[active=true]/button:bg-primary-hover disabled:bg-primary-disabled focus:outline-primary-light aria-disabled:bg-primary-disabled',
		secondary:
			'bg-neutral-light text-text-strong hover:bg-neutral-pressed active:bg-neutral-pressed group-data-[active=true]/button:bg-neutral-pressed disabled:bg-neutral-light disabled:opacity-50 focus:outline-neutral-lighter aria-disabled:bg-neutral-light aria-disabled:opacity-50',
		outline:
			'bg-bg-base text-text-strong ring-1 ring-stroke-weak ring-inset hover:bg-neutral-light active:bg-neutral-light group-data-[active=true]/button:bg-neutral-light disabled:opacity-50 disabled:bg-bg-base aria-disabled:bg-bg-base aria-disabled:opacity-50 focus:outline-stroke-weak focus:ring-stroke-sub shadow-xs',
		none: 'bg-transparent text-text-strong ring-0 hover:bg-neutral-lighter active:bg-neutral-light  group-data-[active=true]/button:bg-neutral-light disabled:opacity-50 disabled:bg-transparent aria-disabled:bg-transparent aria-disabled:opacity-50 focus:outline-stroke-weak',
		error: 'bg-error text-text-base hover:bg-error-hover active:bg-error-hover group-data-[active=true]/button:bg-error-hover disabled:bg-error-disabled focus:outline-error-disabled aria-disabled:bg-error-disabled '
	};

	const sharedClasses =
		'relative group/button flex justify-center items-center transition-all duration-200 ease-in-out font-medium active:scale-95 text-center outline-3 outline-transparent aria-disabled:cursor-not-allowed disabled:cursor-not-allowed cursor-pointer';

	let classes = $derived(twMerge(sharedClasses, sizeClasses[size], colorClasses[color], className));

	let ariaLabel = $derived(iconOnly ? title : undefined);
	let iconSize = $derived(iconOnly ? (size === 'mini' || size === 'small' ? 18 : 20) : 16);
</script>

{#snippet inner()}
	{#if leftIcon}
		<Icon name={leftIcon} size={iconSize} class={leftIconClasses} />
	{/if}

	{#if !iconOnly}
		<div transition:slide>
			{#if children}
				{@render children?.()}
			{:else}
				{title}
			{/if}
		</div>
	{/if}

	{#if rightIcon}
		<Icon name={rightIcon} size={iconSize} class={rightIconClasses} />
	{/if}
{/snippet}

{#if element === 'button'}
	{@const { type, ...restButtonProps } = restProps as HTMLButtonAttributes}
	<button {...restButtonProps} {title} type={type ?? 'button'} aria-label={ariaLabel} class={classes}>
		{@render inner()}
	</button>
{:else if element === 'link'}
	{@const { disabled, href, ...restLinkProps } = restProps as Partial<LinkProps>}
	<a
		{...restLinkProps as HTMLAnchorAttributes}
		href={disabled ? undefined : href}
		role={disabled ? 'link' : undefined}
		class={classes}
		aria-label={ariaLabel}
		aria-disabled={disabled}>
		{@render inner()}
	</a>
{:else}
	{@const { disabled, ...restDivProps } = restProps as Partial<DivProps>}
	<div {...restDivProps as HTMLAttributes<HTMLDivElement>} class={classes} aria-label={ariaLabel} aria-disabled={restProps.disabled}>
		{@render inner()}
	</div>
{/if}
