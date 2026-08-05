<script lang="ts">
	import { Icon } from '$lib/components/base/icons';
	import { client } from '$lib/client';
	import { navigate } from '$lib/utils';
	import { Dropdown } from '$lib/components/base/dropdown';
	import { Avatar } from '$lib/components/base';
	import { APP_NAME } from '$lib/config';

	let { data } = $props();

	const signOut = async () => {
		await client.auth.signOut();
		await navigate('/auth/login');
	};
</script>

<svelte:head>
	<title>Registrierung abgelehnt – {APP_NAME}</title>
</svelte:head>

{#if data?.user}
	<div class="fixed bottom-xl left-xl z-20 w-[min(320px,calc(100vw-2rem))]">
		<Dropdown.Root class="w-full" sameWidth align="start">
			{#snippet trigger()}
				<div class="w-full rounded-md border border-stroke-weak bg-bg-base p-lg">
					<div class="flex items-center gap-md">
						<Avatar user={data.user} style="square" />

						<div class="flex min-w-0 shrink grow flex-col gap-xxs text-left">
							<p class="overflow-hidden typography-label-md font-semibold text-ellipsis whitespace-nowrap">
								{data.user.name}
							</p>
							<p class="overflow-hidden typography-label-2xs text-ellipsis whitespace-nowrap text-text-sub">
								{data.user.email}
							</p>
						</div>

						<Icon name="chevron-down" class="min-w-20 shrink-0 text-icon-sub" />
					</div>
				</div>
			{/snippet}

			{#snippet items()}
				<Dropdown.Item id="logout" onSelect={signOut}>Abmelden</Dropdown.Item>
			{/snippet}
		</Dropdown.Root>
	</div>
{/if}

<div class="flex min-h-dvh w-full items-center justify-center p-lg">
	<div class="flex w-full max-w-520 flex-col items-center gap-24">
		<div class="rounded-16 bg-primary-100 p-12">
			<Icon name="circle-alert" class="block shrink-0 text-primary-900" size={32} />
		</div>

		<div class="text-center">
			<h1 class="typography-h4 font-semibold text-text-strong">Registrierung abgelehnt</h1>
			<p class="mt-16 typography-md text-text-sub">
				Deine Registrierung wurde abgelehnt.<br />Wenn du glaubst, dass das ein Fehler ist, melde dich bitte bei uns.
			</p>
		</div>
	</div>
</div>
