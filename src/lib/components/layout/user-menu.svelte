<script lang="ts">
	import { client } from '$lib/client';
	import { Dropdown } from '$lib/components/base/dropdown';
	import type { MinimalUser } from '$lib/types';
	import { navigate } from '$lib/utils';
	import { Avatar } from '$lib/components/base';
	import { Icon } from '$lib/components/base/icons';

	interface Props {
		isCollapsed?: boolean;
		user: MinimalUser & {
			email: string;
		};
	}

	let { user, isCollapsed = false }: Props = $props();

	const signOut = async () => {
		await client.auth.signOut();
		await navigate('/auth/login');
	};

	const openSettings = async () => {
		await navigate('/settings');
	};
</script>

<Dropdown.Root class="w-full" sameWidth={!isCollapsed} align="start">
	{#snippet trigger()}
		<div
			data-collapsed={isCollapsed}
			class="group w-full rounded-md border border-stroke-weak bg-bg-base p-lg data-[collapsed=true]:p-sm">
			<!-- expanded -->
			<div class="flex items-center gap-md group-data-[collapsed=true]:hidden">
				<div class="flex min-w-0 shrink grow flex-col gap-xxs text-left">
					<p class="overflow-hidden typography-label-md font-semibold text-ellipsis whitespace-nowrap">
						{user.name}
					</p>
					<p class="overflow-hidden typography-label-2xs text-ellipsis whitespace-nowrap text-text-sub">
						{user.email}
					</p>
				</div>

				<Icon name="chevron-down" class="min-w-20 shrink-0 text-icon-sub" />
			</div>

			<!-- collapsed -->
			<Avatar {user} style="square" class="group-data-[collapsed=false]:hidden" />
		</div>
	{/snippet}

	{#snippet items()}
		<Dropdown.Item id="settings" onSelect={openSettings}>Einstellungen</Dropdown.Item>
		<Dropdown.Item id="logout" onSelect={signOut}>Abmelden</Dropdown.Item>
	{/snippet}
</Dropdown.Root>
