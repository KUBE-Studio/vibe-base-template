import { describe, expect, it } from 'bun:test';
import { formatRelativeDayLabel } from './date';

/**
 * Reference test: `bun test src` picks up every `*.test.ts` next to its module.
 * Pure functions are tested directly; anything touching the DB belongs in a
 * repository test with a throwaway database, not here.
 */
describe('formatRelativeDayLabel', () => {
	it('labels today and yesterday relatively', () => {
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		expect(formatRelativeDayLabel(today)).toBe('Heute');
		expect(formatRelativeDayLabel(yesterday)).toBe('Gestern');
	});

	it('falls back to a long date for older years', () => {
		const label = formatRelativeDayLabel(new Date('2020-03-05T10:00:00'));

		expect(label).toContain('2020');
	});
});
