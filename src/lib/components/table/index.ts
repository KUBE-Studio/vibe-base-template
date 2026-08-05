export { default as Table } from '$lib/components/table/table.svelte';
export { default as TableHead } from '$lib/components/table/table-head.svelte';
export { default as TableBody } from '$lib/components/table/table-body.svelte';
export { default as TableRow } from '$lib/components/table/table-row.svelte';
export { default as HeaderCell } from '$lib/components/table/header-cell.svelte';
export { default as TableCell } from '$lib/components/table/table-cell.svelte';
export { default as Pagination } from '$lib/components/table/pagination.svelte';

/** @public */
export interface TableColumn<T> {
	label: string;
	orderBy?: keyof T | string;
	initialSort?: 'asc' | 'desc';
}
