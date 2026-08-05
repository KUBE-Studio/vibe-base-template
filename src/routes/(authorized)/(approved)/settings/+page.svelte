<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { client } from '$lib/client';
	import { Button, Divider } from '$lib/components/base';
	import ConfirmationDialog from '$lib/components/confirmation-dialog.svelte';
	import AppPage from '$lib/components/layout/app-page.svelte';
	import { navigate, toast } from '$lib/utils';
	import { UserForm, type UserFormData } from '$lib/components/forms';
	import { APP_NAME } from '$lib/config';

	let { data } = $props();
	let deleteDialogOpen = $state(false);
	let isDeleting = $state(false);

	async function onUpdateUser(formData: UserFormData) {
		try {
			await client.api.user.updateProfile.mutate(formData);

			await invalidateAll();
			toast.success('Einstellungen gespeichert');
		} catch (error) {
			console.error(error);
			toast.error('Einstellungen konnten nicht gespeichert werden');
		}
	}

	async function deleteAccount() {
		isDeleting = true;

		try {
			await client.api.user.deleteMe.mutate();
			await client.auth.signOut();
			await navigate('/auth/login');
		} catch (error) {
			console.error(error);
			toast.error('Account konnte nicht gelöscht werden');
		} finally {
			isDeleting = false;
			deleteDialogOpen = false;
		}
	}
</script>

<svelte:head>
	<title>Einstellungen – {APP_NAME}</title>
</svelte:head>

<AppPage class="gap-xl">
	<div class="flex items-start justify-between gap-xl">
		<div class="flex flex-col items-start gap-xs">
			<h1 class="typography-h5 font-semibold text-text-strong">Einstellungen</h1>
			<p class="typography-sm text-text-sub">Bearbeite deine Profildaten.</p>
		</div>

		<Button element="button" title="Account löschen" color="error" class="shrink-0" onclick={() => (deleteDialogOpen = true)} />
	</div>

	<Divider />

	<UserForm input={data.user} onSubmit={onUpdateUser} />
</AppPage>

<ConfirmationDialog
	open={deleteDialogOpen}
	title="Account löschen"
	confirmLabel="Account löschen"
	confirmButtonColor="error"
	loading={isDeleting}
	onConfirm={deleteAccount}
	onCancel={() => (deleteDialogOpen = false)}>
	Möchtest du deinen Account wirklich löschen? Du wirst abgemeldet und dein Account wird deaktiviert.
</ConfirmationDialog>
