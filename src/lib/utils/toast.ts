import t, { type ToastOptions } from 'svelte-hot-french-toast';

const options: ToastOptions = {
	class: '',
	position: 'top-end'
};

export const toast = {
	success: (message: string) => t.success(message, options),
	error: (message: string) => t.error(message, options)
};
