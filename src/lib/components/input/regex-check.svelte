<script lang="ts">
	import { Icon } from '$lib/components/base/icons';
	import { twMerge } from '$lib/utils/tw-merge';
	import { slide } from 'svelte/transition';

	interface Props {
		string?: string;
		regexInfo: { label: string; regex: RegExp }[];
		wrapperClass?: string;
	}

	let { string, regexInfo, wrapperClass }: Props = $props();

	let checkedRegex: { label: string; regex: RegExp; valid: boolean }[] = $derived(
		regexInfo.map((item) => {
			item.regex.lastIndex = 0;

			return {
				...item,
				valid: string ? item.regex.test(string) : false
			};
		})
	);

	let validPercentage = $derived(
		regexInfo.length === 0 ? 0 : (checkedRegex.filter((item) => item.valid).length / regexInfo.length) * 100
	);
</script>

{#if validPercentage !== 100}
	<div transition:slide class={twMerge('flex flex-col gap-md', wrapperClass)}>
		<div class="grid grid-cols-2 gap-x-lg gap-y-xs typography-sm">
			{#each checkedRegex as item (item.label)}
				<div data-valid={item.valid} class="d grid grid-cols-[18px_1fr] items-start gap-sm">
					<Icon name="circle-check" class={item.valid ? 'mt-px text-green-600' : 'mt-px text-neutral-400'} size={16} />
					<p class="leading-tight">{item.label}</p>
				</div>
			{/each}
		</div>
	</div>
{/if}
