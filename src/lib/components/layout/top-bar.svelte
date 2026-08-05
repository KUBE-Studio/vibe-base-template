<script lang="ts">
	import type { Snippet } from 'svelte';
	import Breadcrumbs from './breadcrumbs.svelte';
	import MobileMenu from './mobile-menu.svelte';
	import type { MinimalUser } from '$lib/types';

	type BreadcrumbItem = {
		label: string;
		href: string;
		current: boolean;
	};

	interface Props {
		breadcrumbs?: BreadcrumbItem[];
		navItems?: Snippet;
		user?: MinimalUser & {
			email: string;
		};
	}

	let { breadcrumbs = [], navItems, user }: Props = $props();
</script>

<header class="z-10 flex h-4xl items-center gap-lg border-b border-stroke-weak px-sm sm:px-xl">
	<MobileMenu items={navItems} {user} />

	<Breadcrumbs items={breadcrumbs} />
</header>
