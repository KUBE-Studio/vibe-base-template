<script lang="ts">
	import { APP_NAME } from '$lib/config';

	interface Props {
		/** Optional product screenshot/illustration shown behind the copy. */
		imageSrc?: string;
		imageAlt?: string;
		headline?: string;
		body?: string;
	}

	let { imageSrc, imageAlt = '', headline = 'Willkommen zurück.', body = 'Melde dich an, um fortzufahren.' }: Props = $props();
</script>

<aside
	class="relative hidden h-full overflow-hidden rounded-xl border border-stroke-weak bg-bg-soft bg-[linear-gradient(180deg,var(--color-bg-soft)_0%,color-mix(in_srgb,var(--color-bg-soft)_92%,var(--color-bg-weak))_42%,color-mix(in_srgb,var(--color-primary-50)_8%,var(--color-bg-weak))_68%,var(--color-bg-weak)_88%,var(--color-bg-weak)_100%)] lg:block">
	<div
		class="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(-60deg,transparent,transparent_9px,color-mix(in_srgb,var(--color-stroke-soft)_100%,transparent)_9px,color-mix(in_srgb,var(--color-stroke-soft)_100%,transparent)_10px)] mask-[linear-gradient(180deg,#000_0%,#000_18%,rgba(0,0,0,0.3)_42%,transparent_68%)]"
		aria-hidden="true">
	</div>

	<img src="/images/logo.svg" alt={APP_NAME} class="absolute top-40 left-40 z-30 h-48 w-auto" />

	{#if imageSrc}
		<div
			class="pointer-events-none absolute top-176 right-0 bottom-0 left-80 overflow-hidden mask-[linear-gradient(180deg,#000_0%,#000_24%,rgba(0,0,0,0.8)_38%,rgba(0,0,0,0.45)_56%,transparent_76%)]">
			<img src={imageSrc} alt={imageAlt} class="ml-auto block h-full w-auto max-w-[unset]" />
		</div>
	{/if}

	<div class="absolute right-0 bottom-0 left-0 z-20 px-64 pb-64">
		<h2 class="typography-h5 font-semibold tracking-[-0.03em] text-text-strong">{headline}</h2>
		<p class="mt-lg typography-md leading-normal text-text-sub">{body}</p>
	</div>
</aside>
