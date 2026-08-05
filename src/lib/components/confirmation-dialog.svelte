<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Button, Dialog, type ButtonColor } from '$lib/components/base';

	type Props = {
		open: boolean;
		title: string;
		loading?: boolean;
		confirmDisabled?: boolean;
		confirmLabel?: string;
		loadingLabel?: string;
		cancelLabel?: string;
		children?: Snippet;
		onConfirm: () => Promise<void> | void;
		onCancel: () => void;
		confirmButtonColor?: ButtonColor;
	};

	let {
		open,
		title,
		loading = false,
		confirmDisabled = false,
		confirmLabel = 'Bestätigen',
		loadingLabel = 'Wird gesendet…',
		cancelLabel = 'Abbrechen',
		children,
		onConfirm,
		onCancel,
		confirmButtonColor = 'secondary'
	}: Props = $props();

	let dialogOpen = $derived(open);

	$effect(() => {
		if (!dialogOpen && open && !loading) {
			onCancel();
		}
	});
</script>

<Dialog bind:open={dialogOpen} closable={!loading} class="w-600 max-w-[90vw] rounded-lg">
	<h2 id="confirmation-dialog-title" class="mb-sm typography-h6 font-semibold">{title}</h2>

	<div class="typography-sm text-text-sub">
		{@render children?.()}
	</div>

	<div class="mt-xl flex justify-end gap-sm">
		<Button element="button" title={cancelLabel} disabled={loading} onclick={onCancel} color="none" />
		<Button
			element="button"
			color={confirmButtonColor}
			title={loading ? loadingLabel : confirmLabel}
			disabled={loading || confirmDisabled}
			onclick={onConfirm} />
	</div>
</Dialog>
