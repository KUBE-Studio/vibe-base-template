<script lang="ts">
	import { Dialog } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	interface Props {
		children: Snippet;
		open: boolean;
		class?: string;
		closable?: boolean;
	}

	let { children, open = $bindable(), class: className, closable = true }: Props = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/40" />

		<Dialog.Content
			interactOutsideBehavior={closable ? 'close' : 'ignore'}
			escapeKeydownBehavior={closable ? 'close' : 'ignore'}
			preventScroll={true}
			class={twMerge(
				'fixed top-1/2 left-1/2 z-50 w-full max-w-[94vw] -translate-x-1/2 -translate-y-1/2 rounded-md border border-stroke-weak bg-white p-xl shadow-2xl outline-hidden sm:max-w-600',
				className
			)}>
			{@render children()}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
