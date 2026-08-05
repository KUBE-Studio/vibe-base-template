<script lang="ts">
	import { invalidateAll, goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { client } from '$lib/client';
	import { Avatar, Button, Divider } from '$lib/components/base';
	import { Tabs } from '$lib/components/base/tabs';
	import { HeaderCell, Pagination, Table, TableBody, TableCell, TableHead, TableRow } from '$lib/components/table';
	import { ROLE_LABELS } from '$lib/labels';
	import { Role } from '$lib/types';
	import { toast } from '$lib/utils';
	import { Select } from '$lib/components/input';
	import AppPage from '$lib/components/layout/app-page.svelte';
	import { APP_NAME } from '$lib/config';

	let { data } = $props();

	let selectedRoles = $state<Record<string, Role>>({});
	let processingId = $state<string | null>(null);

	const isDeclinedTab = $derived(data.tab === 'declined');
	const totalPages = $derived(Math.ceil(data.registrations.total / data.registrations.pageSize));

	const columns = $derived([
		{ label: 'Name' },
		{ label: 'Unternehmen' },
		{ label: isDeclinedTab ? 'Abgelehnt am' : 'Eingereicht' },
		{ label: 'Rolle' },
		{ label: '' }
	]);

	const tabHref = (tab: string) => resolve(`/admin/registrations?tab=${tab}`);
	const pageHref = (page: number) => {
		if (page <= 1) {
			return isDeclinedTab ? resolve('/admin/registrations?tab=declined') : resolve('/admin/registrations');
		}

		return isDeclinedTab
			? resolve(`/admin/registrations?tab=declined&page=${page}` as `/admin/registrations?${string}`)
			: resolve(`/admin/registrations?page=${page}` as `/admin/registrations?${string}`);
	};

	const dateFormatter = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' });

	const selectRole = (userId: string, role: Role) => {
		selectedRoles = { ...selectedRoles, [userId]: role };
	};

	const runAction = async (userId: string, action: () => Promise<unknown>, successMessage: string) => {
		processingId = userId;

		try {
			await action();
			await invalidateAll();
			toast.success(successMessage);
		} catch (error) {
			console.error(error);
			toast.error('Aktion fehlgeschlagen');
		} finally {
			processingId = null;
		}
	};

	const approve = (userId: string) =>
		runAction(
			userId,
			() => client.api.registration.approve.mutate({ userId, role: selectedRoles[userId] ?? Role.USER }),
			'Registrierung freigegeben'
		);

	const approveDeclined = (userId: string) =>
		runAction(
			userId,
			() => client.api.registration.approveDeclined.mutate({ userId, role: selectedRoles[userId] ?? Role.USER }),
			'Registrierung freigegeben'
		);

	const decline = (userId: string) =>
		runAction(userId, () => client.api.registration.decline.mutate({ userId }), 'Registrierung abgelehnt');
</script>

<svelte:head>
	<title>Registrierungen – {APP_NAME}</title>
</svelte:head>

<AppPage>
	<div class="mb-xl flex items-start justify-between gap-xl">
		<div>
			<h1 class="typography-h5 font-semibold text-text-strong">Registrierungen</h1>
			<p class="mt-xs typography-sm text-text-sub">Prüfe neue Registrierungen und entscheide über Freigabe oder Ablehnung.</p>
		</div>
	</div>

	<Divider class="mb-xl" />

	<Tabs.Root value={data.tab} class="mb-xl">
		<Tabs.List>
			<Tabs.Trigger value="pending" onClick={() => goto(tabHref('pending'))}>Offen</Tabs.Trigger>
			<Tabs.Trigger value="declined" onClick={() => goto(tabHref('declined'))}>Abgelehnt</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>

	{#if data.registrations.items.length === 0}
		<p class="typography-sm text-text-sub">
			{isDeclinedTab ? 'Keine abgelehnten Registrierungen' : 'Keine offenen Registrierungen'}
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
					{#each data.registrations.items as registration (registration.id)}
						<TableRow class="bg-bg-base odd:bg-bg-base even:bg-bg-base">
							<TableCell class="px-lg py-md">
								<div class="flex items-center gap-md">
									<Avatar user={registration} class="size-4xl min-w-4xl" />
									<div class="min-w-0">
										<p class="truncate typography-label-xs font-semibold text-text-strong">{registration.name}</p>
										<p class="truncate typography-2xs font-normal text-text-sub">{registration.email}</p>
									</div>
								</div>
							</TableCell>

							<TableCell class="px-lg py-md typography-label-xs text-text-strong">
								{registration.companyName ?? '—'}
							</TableCell>

							<TableCell class="px-lg py-md typography-label-xs text-text-sub">
								{#if isDeclinedTab}
									{'declinedAt' in registration && registration.declinedAt instanceof Date
										? dateFormatter.format(registration.declinedAt)
										: '—'}
								{:else}
									{registration.applicationSubmittedAt ? dateFormatter.format(registration.applicationSubmittedAt) : '—'}
								{/if}
							</TableCell>

							<TableCell class="px-lg py-md">
								<Select
									id={`role-${registration.id}`}
									type="single"
									size={40}
									required
									items={Object.entries(ROLE_LABELS).map(([key, value]) => ({ label: value, value: key }))}
									onValueChange={(e) => selectRole(registration.id, e as Role)}
									bind:value={selectedRoles[registration.id]} />
							</TableCell>

							<TableCell class="px-lg py-md">
								<div class="flex justify-end gap-sm">
									{#if !isDeclinedTab}
										<Button
											element="button"
											title="Ablehnen"
											size="small"
											color="outline"
											disabled={processingId === registration.id}
											onclick={() => void decline(registration.id)} />
									{/if}

									<Button
										element="button"
										title="Freigeben"
										size="small"
										color="primary"
										disabled={processingId === registration.id}
										onclick={() =>
											void (isDeclinedTab ? approveDeclined(registration.id) : approve(registration.id))} />
								</div>
							</TableCell>
						</TableRow>
					{/each}
				</TableBody>
			</Table>
		</div>

		<Pagination
			page={data.registrations.page}
			{totalPages}
			totalCount={data.registrations.total}
			previousHref={data.registrations.page > 1 ? pageHref(data.registrations.page - 1) : undefined}
			nextHref={data.registrations.page < totalPages ? pageHref(data.registrations.page + 1) : undefined} />
	{/if}
</AppPage>
