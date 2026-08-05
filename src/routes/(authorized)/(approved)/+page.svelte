<script lang="ts">
	import AppPage from '$lib/components/layout/app-page.svelte';
	import { APP_NAME } from '$lib/config';

	let { data } = $props();
</script>

<svelte:head>
	<title>Start – {APP_NAME}</title>
</svelte:head>

<AppPage class="gap-xl">
	<div class="flex flex-col items-start gap-xs">
		<h1 class="typography-h5 font-semibold text-text-strong">Hallo {data.user.firstName}</h1>
		<p class="typography-sm text-text-sub">
			Startseite der App. Ersetze diese Seite durch die erste echte Ansicht — Layout, Sidebar und Auth stehen bereits.
		</p>
	</div>
</AppPage>
