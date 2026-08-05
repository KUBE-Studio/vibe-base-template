<script lang="ts">
	import { Sidebar } from '$lib/components/layout/sidebar';
	import { Role } from '$lib/types';
	import { page } from '$app/state';
	import TopBar from '$lib/components/layout/top-bar.svelte';

	/** Path segment → breadcrumb label. Add an entry per new route. */
	const BREADCRUMB_LABELS: Record<string, string> = {
		settings: 'Einstellungen',
		admin: 'Admin',
		users: 'Benutzer',
		registrations: 'Registrierungen'
	};

	let { children, data } = $props();

	let isAdmin = $derived(data.user?.role === Role.ADMIN);
	let isAdminArea = $derived(page.url.pathname.startsWith('/admin'));

	let breadcrumbs = $derived.by(() => {
		const segments = page.url.pathname.split('/').filter(Boolean);

		return segments.map((segment, index) => ({
			label: BREADCRUMB_LABELS[segment] ?? decodeURIComponent(segment),
			href: '/' + segments.slice(0, index + 1).join('/'),
			current: index === segments.length - 1
		}));
	});
</script>

{#snippet navItems()}
	{#if isAdminArea}
		<Sidebar.Item href="/admin/users" title="Benutzer" icon="users" />
		<Sidebar.Item href="/admin/registrations" title="Registrierungen" icon="scan-face" />
		<Sidebar.Item href="/" class="mt-auto" title="App" icon="shield-off" />
	{:else}
		<Sidebar.Item href="/" title="Start" icon="list-checks" />
		<Sidebar.Item href="/settings" title="Einstellungen" icon="user" />
		{#if isAdmin}
			<Sidebar.Item href="/admin/users" class="mt-auto" title="Admin" icon="shield-user" />
		{/if}
	{/if}
{/snippet}

<div class="flex h-screen overflow-hidden">
	<Sidebar.Root user={data.user}>
		{@render navItems()}
	</Sidebar.Root>

	<div class="flex h-full min-w-0 grow flex-col overflow-hidden">
		<TopBar {breadcrumbs} {navItems} user={data.user} />

		{@render children()}
	</div>
</div>
