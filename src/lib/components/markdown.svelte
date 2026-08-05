<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import DOMPurify from 'dompurify';
	import { twMerge } from '$lib/utils/tw-merge';
	import { marked } from 'marked';

	interface Props {
		markdown?: string;
		class?: string;
	}

	let { markdown, class: className }: Props = $props();
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});

	const html = $derived(marked.parse(String(markdown ?? ''), { async: false }));

	const sanetized = $derived(browser && mounted ? DOMPurify.sanitize(html) : '');
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<article class={twMerge('prose lg:prose-sm', className)}>{@html sanetized}</article>
