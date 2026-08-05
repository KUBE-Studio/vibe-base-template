<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/base/button.svelte';
	import type { MinimalUser } from '$lib/types';
	import UserMenu from '../user-menu.svelte';

	interface Props {
		children: Snippet;
		user?: MinimalUser & {
			email: string;
		};
	}

	let { children, user }: Props = $props();

	let isCollapsed = $state(false);
</script>

<aside
	data-collapsed={isCollapsed}
	id="sidebar"
	class="group flex h-screen flex-col border-r border-stroke-weak transition-[width] data-[collapsed=false]:w-260 data-[collapsed=false]:min-w-260 data-[collapsed=true]:w-90 data-[collapsed=true]:min-w-90 max-lg:hidden">
	<div class="relative flex h-4xl items-center justify-between gap-lg overflow-hidden border-b border-stroke-weak px-xl py-md">
		<img
			src="/images/logo.svg"
			alt="Alchimedus Logo"
			class="h-xl max-h-xl shrink-0 transition-transform duration-200 group-data-[collapsed=true]:mx-auto" />

		<Button
			element="button"
			iconOnly
			title={isCollapsed ? 'Einklappen' : 'Ausklappen'}
			leftIcon="panel-right"
			onclick={() => (isCollapsed = !isCollapsed)}
			class="absolute top-1/2 right-xl z-10 w-fit -translate-y-1/2 rounded-sm bg-transparent p-xs text-text-sub transition-[opacity,transform,color,background-color,box-shadow] group-data-[collapsed=true]:right-auto group-data-[collapsed=true]:left-1/2 group-data-[collapsed=true]:-translate-x-1/2 group-data-[collapsed=true]:opacity-0 hover:text-text-strong group-data-[collapsed=true]:hover:opacity-100" />
	</div>

	<div class="flex grow flex-col gap-xs p-lg">
		<p class="px-md py-xs text-11 tracking-[0.33px] text-text-soft uppercase">Menü</p>

		{@render children()}
	</div>

	{#if user}
		<div class="w-full border-t border-stroke-weak p-lg group-data-[collapsed=true]:mb-lg">
			<UserMenu {user} {isCollapsed} />
		</div>
	{/if}
</aside>
