const dateFormatLong = new Intl.DateTimeFormat('de', { dateStyle: 'long' });
const dateFormatShort = new Intl.DateTimeFormat('de', { dateStyle: 'short' });
const timeFormatShort = new Intl.DateTimeFormat('de', { timeStyle: 'short' });
const weekdayFormat = new Intl.DateTimeFormat('de', { weekday: 'long' });
const weekdayDateFormat = new Intl.DateTimeFormat('de', {
	weekday: 'short',
	day: 'numeric',
	month: 'long'
});

const MS_PER_DAY = 86_400_000;

const getStartOfDay = (value: Date) => {
	return new Date(value.getFullYear(), value.getMonth(), value.getDate());
};

export const formatRelativeDayLabel = (value: Date) => {
	const today = getStartOfDay(new Date());
	const dateDay = getStartOfDay(value);
	const diffDays = Math.round((today.getTime() - dateDay.getTime()) / MS_PER_DAY);

	if (diffDays === 0) return 'Heute';
	if (diffDays === 1) return 'Gestern';
	if (diffDays > 1 && diffDays < 7) return weekdayFormat.format(value);
	if (value.getFullYear() === today.getFullYear()) return weekdayDateFormat.format(value);

	return dateFormatLong.format(value);
};

/** @public — sibling of formatRelativeDayLabel, for timestamps in lists. */
export const formatRelativeDateLabel = (value: Date) => {
	const today = getStartOfDay(new Date());
	const dateDay = getStartOfDay(value);
	const diffDays = Math.round((today.getTime() - dateDay.getTime()) / MS_PER_DAY);

	if (diffDays === 0) return timeFormatShort.format(value);
	if (diffDays === 1) return 'Gestern';
	if (diffDays > 1 && diffDays < 7) return weekdayFormat.format(value);
	if (value.getFullYear() === today.getFullYear()) return dateFormatShort.format(value);

	return dateFormatLong.format(value);
};
