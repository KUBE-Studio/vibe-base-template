<script lang="ts">
	import { Icon } from '$lib/components/base/icons';

	type BreadcrumbItem = {
		label: string;
		href: string;
		current: boolean;
	};

	let { items = [] }: { items?: BreadcrumbItem[] } = $props();
</script>

<nav aria-label="Breadcrumb" class="flex min-w-0 items-center gap-sm overflow-x-auto whitespace-nowrap">
	<span class="shrink-0 typography-label-2xs font-semibold text-text-soft">Menü</span>

	{#each items as item (item.href)}
		<Icon name="chevron-right" size={16} class="shrink-0 text-text-soft" />

		{#if item.current}
			<span class="max-w-220 truncate typography-label-2xs font-semibold text-text-strong">{item.label}</span>
		{:else if item.href === '/admin'}
			<span class="max-w-220 truncate typography-label-2xs font-semibold text-text-soft">{item.label}</span>
		{:else}
			<a
				href={item.href}
				class="max-w-180 truncate typography-label-2xs font-semibold text-text-soft transition-colors hover:text-text-strong">
				{item.label}
			</a>
		{/if}
	{/each}
</nav>
