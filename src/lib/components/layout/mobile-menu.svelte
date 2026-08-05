<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { beforeNavigate } from '$app/navigation';
	import Button from '$lib/components/base/button.svelte';
	import type { Snippet } from 'svelte';
	import type { MinimalUser } from '$lib/types';
	import UserMenu from './user-menu.svelte';

	interface Props {
		items?: Snippet;
		user?: MinimalUser & {
			email: string;
		};
	}

	let { items, user }: Props = $props();

	let open = $state(false);

	beforeNavigate(() => {
		open = false;
	});
</script>

<Button title="Menü" element="button" iconOnly leftIcon="menu" color="none" class="lg:hidden" onclick={() => (open = true)} />

{#if open}
	<div class="fixed top-0 left-0 z-100 h-screen w-screen lg:hidden">
		<!-- overlay -->
		<button
			transition:fade={{ duration: 200 }}
			type="button"
			onclick={() => (open = false)}
			class="absolute top-0 left-0 z-0 h-full w-full bg-neutral/7 backdrop-blur-xl"
			aria-label="close"></button>

		<!-- content -->
		<div transition:fly={{ x: '-100%' }} class="relative z-10 flex h-full w-280 flex-col gap-lg border-stroke-weak bg-bg-base p-lg">
			<div class="flex items-center justify-between py-sm">
				<img src="/images/logo.svg" alt="Alchimedus Logo" class="h-xl max-h-xl shrink-0 transition-transform duration-200" />

				<Button
					iconOnly
					title="Menü schließen"
					element="button"
					size="small"
					color="none"
					leftIcon="x-close"
					onclick={() => (open = false)}
					class="bg-transparent" />
			</div>

			<div class="flex grow flex-col gap-xs p-sm">
				<p class="px-md py-xs text-11 tracking-[0.33px] text-text-soft uppercase">Menü</p>

				{@render items?.()}
			</div>

			{#if user}
				<UserMenu {user} isCollapsed={false} />
			{/if}
		</div>
	</div>
{/if}
