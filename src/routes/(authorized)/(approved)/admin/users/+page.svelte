<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { client } from '$lib/client';
	import { Dropdown } from '$lib/components/base/dropdown';
	import { Select } from '$lib/components/input';
	import { Avatar, Button, Divider } from '$lib/components/base';
	import { Tabs } from '$lib/components/base/tabs';
	import { Icon } from '$lib/components/base/icons';
	import { HeaderCell, Pagination, Table, TableBody, TableCell, TableHead, TableRow } from '$lib/components/table';
	import CheckboxSelectFilter from '$lib/components/table/filters/checkbox-select-filter.svelte';
	import SearchBar from '$lib/components/table/filters/search-bar.svelte';
	import ConfirmationDialog from '$lib/components/confirmation-dialog.svelte';
	import { ROLE_LABELS } from '$lib/labels';
	import { Role } from '$lib/types';
	import { toast } from '$lib/utils';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import AppPage from '$lib/components/layout/app-page.svelte';
	import { APP_NAME } from '$lib/config';

	type PendingAction = {
		kind: 'revoke' | 'restore' | 'delete';
		userId: string;
		userName: string;
	};

	let { data } = $props();

	let selectedRoles = $state<Record<string, Role>>({});
	let processingId = $state<string | null>(null);
	let pendingAction = $state<PendingAction | null>(null);

	const totalPages = $derived(Math.ceil(data.users.total / data.users.pageSize));
	const hasActiveFilters = $derived(Boolean(data.search) || data.roles.length > 0);

	const dateFormatter = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' });

	const columns = [{ label: 'Name' }, { label: 'Unternehmen' }, { label: 'Seit' }, { label: 'Rolle' }, { label: '' }];

	const DIALOG_COPY = {
		revoke: { title: 'Zugriff entziehen', confirmLabel: 'Zugriff entziehen', success: 'Zugriff entzogen' },
		restore: { title: 'Zugriff wiedergeben', confirmLabel: 'Zugriff wiedergeben', success: 'Zugriff wiederhergestellt' },
		delete: { title: 'Benutzer löschen', confirmLabel: 'Löschen', success: 'Benutzer gelöscht' }
	} as const;

	const buildUrl = (params: { q?: string; page?: number; roles?: Role[]; tab?: string }) => {
		const q = params.q ?? data.search;
		const roles = params.roles ?? data.roles;
		const tab = params.tab ?? data.tab;
		const searchParams = new SvelteURLSearchParams();

		if (q) {
			searchParams.set('q', q);
		}

		for (const role of roles) {
			searchParams.append('role', role);
		}

		if (params.page && params.page > 1) {
			searchParams.set('page', String(params.page));
		}

		if (tab && tab !== 'active') {
			searchParams.set('tab', tab);
		}

		const query = searchParams.toString();

		return query ? resolve(`/admin/users?${query}`) : resolve('/admin/users');
	};

	const onSearch = (searchValue: string | undefined) => {
		goto(buildUrl({ q: searchValue, page: 1 }), { keepFocus: true, replaceState: true });
	};

	const toggleRoles = (roles: Role[]) => {
		goto(buildUrl({ roles, page: 1 }), { keepFocus: true, replaceState: true });
	};

	const selectRole = (userId: string, role: Role) => {
		selectedRoles = { ...selectedRoles, [userId]: role };
	};

	const resetRole = (userId: string) => {
		const { [userId]: _removed, ...rest } = selectedRoles;
		selectedRoles = rest;
	};

	const changeRole = async (userId: string, currentRole: Role) => {
		const role = selectedRoles[userId] ?? currentRole;

		if (role === currentRole) {
			return;
		}

		processingId = userId;

		try {
			await client.api.adminUser.changeRole.mutate({ userId, role });
			await invalidateAll();
			toast.success('Rolle aktualisiert');
		} catch (error) {
			console.error(error);
			toast.error('Rolle konnte nicht aktualisiert werden');
		} finally {
			processingId = null;
		}
	};

	const confirmPendingAction = async () => {
		if (!pendingAction) {
			return;
		}

		const { kind, userId } = pendingAction;
		processingId = userId;

		try {
			if (kind === 'revoke') {
				await client.api.adminUser.revokeAccess.mutate({ userId });
			} else if (kind === 'restore') {
				await client.api.adminUser.restoreAccess.mutate({ userId });
			} else {
				await client.api.adminUser.delete.mutate({ userId });
			}

			await invalidateAll();
			toast.success(DIALOG_COPY[kind].success);
		} catch (error) {
			console.error(error);
			toast.error('Aktion fehlgeschlagen');
		} finally {
			processingId = null;
			pendingAction = null;
		}
	};
</script>

<svelte:head>
	<title>Benutzer – {APP_NAME}</title>
</svelte:head>

<AppPage>
	<div class="mb-xl flex items-start justify-between gap-xl">
		<div>
			<h1 class="typography-h5 font-semibold text-text-strong">Benutzer</h1>
			<p class="mt-xs typography-sm text-text-sub">Verwalte Benutzerkonten, Rollen und Zugriffsrechte.</p>
		</div>
	</div>

	<Divider class="mb-xl" />

	<Tabs.Root value={data.tab} class="mb-xl">
		<Tabs.List>
			<Tabs.Trigger value="active" onClick={() => goto(buildUrl({ tab: 'active', page: 1 }))}>Aktiv</Tabs.Trigger>
			<Tabs.Trigger value="revoked" onClick={() => goto(buildUrl({ tab: 'revoked', page: 1 }))}>Gesperrt</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>

	<div class="mb-xl flex flex-wrap items-center justify-between gap-md">
		<CheckboxSelectFilter
			id="roles"
			type="multiple"
			title="Rolle"
			icon="flag"
			items={Object.entries(ROLE_LABELS).map(([key, value]) => ({ label: value, value: key }))}
			value={data.roles}
			onValueChange={(e) => toggleRoles(e as Role[])} />

		<SearchBar value={data.search} {onSearch} />
	</div>

	{#if data.users.items.length === 0}
		<p class="typography-sm text-text-sub">
			{hasActiveFilters ? 'Keine passenden Benutzer gefunden.' : 'Keine Benutzer vorhanden.'}
		</p>
	{:else}
		<div class="overflow-x-hidden rounded-lg border border-stroke-weak bg-bg-base">
			<Table responsive minWidthClass="min-w-920" class="w-full border-collapse text-left typography-sm">
				<TableHead class="bg-bg-soft/40">
					<TableRow class="after:hidden">
						{#each columns as column, i (column.label + i)}
							<HeaderCell class={i === columns.length - 1 ? 'text-right' : undefined}>
								<p>{column.label}</p>
							</HeaderCell>
						{/each}
					</TableRow>
				</TableHead>

				<TableBody class="divide-y divide-stroke-weak">
					{#each data.users.items as user (user.id)}
						{@const selectedRole = selectedRoles[user.id] ?? user.role}
						{@const isRoleDirty = selectedRole !== user.role}
						<TableRow class="bg-bg-base odd:bg-bg-base even:bg-bg-base">
							<TableCell class="px-lg py-md">
								<div class="flex items-center gap-md">
									<Avatar {user} class="size-4xl min-w-4xl" />
									<div class="min-w-0">
										<p class="truncate typography-label-xs font-semibold text-text-strong">{user.name}</p>
										<p class="truncate typography-2xs font-normal text-text-sub">{user.email}</p>
									</div>
								</div>
							</TableCell>

							<TableCell class="px-lg py-md typography-label-xs text-text-strong">
								{user.companyName ?? '—'}
							</TableCell>

							<TableCell class="px-lg py-md typography-label-xs text-text-sub">
								{dateFormatter.format(user.approvedAt ?? user.createdAt)}
							</TableCell>

							<TableCell class="px-lg py-md">
								<Select
									id={`role-${user.id}`}
									type="single"
									size={40}
									required
									disabled={data.tab === 'revoked'}
									items={Object.entries(ROLE_LABELS).map(([key, value]) => ({ label: value, value: key }))}
									value={selectedRole}
									onValueChange={(e) => selectRole(user.id, e as Role)} />
							</TableCell>

							<TableCell class="px-lg py-md" style="width: 96px;">
								<div class="ml-auto flex justify-end gap-sm" style="width: 88px;">
									{#if isRoleDirty}
										<Button
											element="button"
											title="Änderung speichern"
											iconOnly
											size="small"
											color="outline"
											leftIcon="check"
											leftIconClasses="text-green-600"
											class="h-36 w-36 rounded-lg p-0"
											disabled={processingId === user.id}
											onclick={() => void changeRole(user.id, user.role)} />

										<Button
											element="button"
											title="Änderung verwerfen"
											iconOnly
											size="small"
											color="outline"
											leftIcon="x-close"
											leftIconClasses="text-text-sub"
											class="h-36 w-36 rounded-lg p-0"
											disabled={processingId === user.id}
											onclick={() => resetRole(user.id)} />
									{:else}
										<Dropdown.Root align="end">
											{#snippet trigger()}
												<Button
													element="button"
													title="Mehr Aktionen"
													iconOnly
													size="small"
													color="none"
													leftIcon="ellipsis"
													disabled={processingId === user.id}
													class="h-36 w-36 rounded-lg p-0 text-text-sub hover:text-text-strong" />
											{/snippet}

											{#snippet items()}
												{#if data.tab === 'revoked'}
													<Dropdown.Item
														id={`restore-${user.id}`}
														disabled={processingId === user.id}
														onSelect={() =>
															(pendingAction = { kind: 'restore', userId: user.id, userName: user.name })}>
														<Icon name="user-round-check" size={18} class="text-text-sub" />
														<span>Zugriff wiedergeben</span>
													</Dropdown.Item>
												{:else}
													<Dropdown.Item
														id={`revoke-${user.id}`}
														disabled={processingId === user.id}
														onSelect={() =>
															(pendingAction = { kind: 'revoke', userId: user.id, userName: user.name })}>
														<Icon name="user-round-minus" size={18} class="text-text-sub" />
														<span>Zugriff entziehen</span>
													</Dropdown.Item>
												{/if}

												<Dropdown.Item
													id={`delete-${user.id}`}
													disabled={processingId === user.id}
													onSelect={() =>
														(pendingAction = { kind: 'delete', userId: user.id, userName: user.name })}>
													<Icon name="trash-2" size={18} class="text-text-sub" />
													<span>Löschen</span>
												</Dropdown.Item>
											{/snippet}
										</Dropdown.Root>
									{/if}
								</div>
							</TableCell>
						</TableRow>
					{/each}
				</TableBody>
			</Table>
		</div>

		<Pagination
			page={data.users.page}
			{totalPages}
			totalCount={data.users.total}
			previousHref={data.users.page > 1 ? buildUrl({ page: data.users.page - 1 }) : undefined}
			nextHref={data.users.page < totalPages ? buildUrl({ page: data.users.page + 1 }) : undefined} />
	{/if}
</AppPage>

<ConfirmationDialog
	open={pendingAction !== null}
	title={pendingAction ? DIALOG_COPY[pendingAction.kind].title : ''}
	confirmLabel={pendingAction ? DIALOG_COPY[pendingAction.kind].confirmLabel : ''}
	confirmButtonColor={pendingAction?.kind === 'restore' ? 'primary' : 'error'}
	loading={processingId !== null}
	onConfirm={confirmPendingAction}
	onCancel={() => (pendingAction = null)}>
	<span class="font-semibold">{pendingAction?.userName}</span> — Aktion wirklich ausführen?
</ConfirmationDialog>
