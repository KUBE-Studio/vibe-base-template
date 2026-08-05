<script lang="ts">
	import { TextInput } from '$lib/components/input';

	interface Props {
		value?: string;
		onSearch: (searchValue: string | undefined) => void;
	}

	let { value, onSearch }: Props = $props();

	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	const onSearchInput = () => {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			onSearch(value);
		}, 300);
	};
</script>

<TextInput
	id="search"
	type="search"
	placeholder="Suchen..."
	leftIcon="search"
	bind:value
	oninput={onSearchInput}
	size={36}
	class="min-w-200 border-stroke-soft bg-neutral-100 typography-label-md [&::-webkit-search-cancel-button]:hidden" />
