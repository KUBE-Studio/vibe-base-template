<script lang="ts">
	import { IconRegistry, type RegisteredIconNames } from '$lib/components/base/icons';
	import { twMerge } from '$lib/utils/tw-merge';

	interface Props {
		name: RegisteredIconNames;
		class?: string;
		size?: number;
		strokeWidth?: string | number;
	}

	let { name, size = 20, class: className, strokeWidth = 2 }: Props = $props();

	let Component = $derived(IconRegistry[name]);
</script>

<Component {size} aria-hidden={true} {strokeWidth} class={twMerge('', className)} />
