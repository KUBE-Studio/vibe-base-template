<script lang="ts">
	import { twMerge } from '$lib/utils/tw-merge';

	interface Props {
		class?: string;
	}

	let { class: className }: Props = $props();
</script>

<div class={twMerge('w-full border-b border-stroke-weak', className)}></div>
