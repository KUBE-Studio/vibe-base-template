<script lang="ts">
	import { Role, type MinimalUser } from '$lib/types';
	import { twMerge } from '$lib/utils/tw-merge';

	interface Props {
		user: MinimalUser;
		style?: 'circle' | 'square';
		class?: string;
	}

	let { user, style = 'circle', class: className }: Props = $props();

	const roleClasses: Record<Role, string> = {
		[Role.ADMIN]: 'bg-primary text-text-base',
		[Role.USER]: 'bg-bg-soft text-text-sub'
	};
</script>

<div
	class={twMerge(
		'flex size-3xl min-w-3xl items-center justify-center',
		style === 'circle' ? 'rounded-full' : 'rounded-md',
		roleClasses[user.role],
		className
	)}>
	<p class="uppercase select-none">{user.firstName[0]}{user.lastName[0]}</p>
</div>
