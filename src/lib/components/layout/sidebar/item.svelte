<script lang="ts" generics="T extends PathnameWithSearchOrHash">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { PathnameWithSearchOrHash } from '$app/types';
	import { Chip } from '$lib/components/base';
	import { Icon, type RegisteredIconNames } from '$lib/components/base/icons';
	import { twMerge } from '$lib/utils/tw-merge';

	interface Props {
		class?: string;
		href: T;
		icon: RegisteredIconNames;
		title: string;
		badgeCount?: number;
	}

	let { href, icon, title, badgeCount = 0, class: className }: Props = $props();

	const resolved = $derived(resolve(...([href] as Parameters<typeof resolve<T>>)));

	const isActive = $derived(page.url.pathname === resolved || page.url.pathname.startsWith(resolved + '/'));
</script>

<a
	{href}
	data-active={isActive}
	{title}
	class={twMerge(
		'relative flex items-center justify-start gap-sm overflow-hidden rounded-md bg-transparent px-md py-sm typography-label-md font-semibold text-text-sub outline-neutral-lighter transition-all group-data-[collapsed=false]:w-full group-data-[collapsed=true]:ml-10.5 group-data-[collapsed=true]:w-36 group-data-[collapsed=true]:px-sm hover:bg-neutral-lighter focus:outline-3 data-[active=true]:bg-neutral-light data-[active=true]:text-text-strong',
		className
	)}>
	<Icon name={icon} size={20} class="shrink-0" />

	<!-- collapsed part -->

	<p class="min-w-0 truncate group-data-[collapsed=true]:hidden">{title}</p>
	{#if badgeCount > 0}
		<Chip color="primary" class="ml-auto group-data-[collapsed=true]:hidden">
			{badgeCount > 99 ? '99+' : badgeCount}
		</Chip>
	{/if}
</a>
