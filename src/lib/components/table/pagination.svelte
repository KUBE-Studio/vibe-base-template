<script lang="ts">
	import { Icon } from '$lib/components/base/icons';

	interface Props {
		page: number;
		totalPages: number;
		previousHref?: string;
		nextHref?: string;
		totalCount?: number;
		singularLabel?: string;
		pluralLabel?: string;
		class?: string;
	}

	let {
		page,
		totalPages,
		previousHref,
		nextHref,
		totalCount,
		singularLabel = 'Zeile',
		pluralLabel = 'Zeilen',
		class: className = ''
	}: Props = $props();
</script>

{#if totalPages > 1}
	<div class={`mt-lg flex items-center justify-between ${className}`.trim()}>
		{#if totalCount !== undefined}
			<p class="typography-sm text-text-soft">{totalCount} {totalCount === 1 ? singularLabel : pluralLabel}</p>
		{:else}
			<span></span>
		{/if}

		<div class="flex items-center gap-sm">
			<a
				href={previousHref}
				title="Vorherige Seite"
				aria-disabled={!previousHref}
				class="disabled:opacity-50"
				class:pointer-events-none={!previousHref}
				class:opacity-50={!previousHref}>
				<Icon name="chevron-left" size={14} class="text-text-soft" />
			</a>

			<p class="typography-xs font-semibold">{page} / {totalPages}</p>

			<a
				href={nextHref}
				title="Nächste Seite"
				aria-disabled={!nextHref}
				class="disabled:opacity-50"
				class:pointer-events-none={!nextHref}
				class:opacity-50={!nextHref}>
				<Icon name="chevron-right" size={14} class="text-text-soft" />
			</a>
		</div>
	</div>
{/if}
