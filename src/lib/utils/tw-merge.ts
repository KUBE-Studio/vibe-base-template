import { extendTailwindMerge, validators } from 'tailwind-merge';

const colorSubGroups = ['soft', 'base', 'strong', 'surface', 'sub', 'primary', 'weak', 'disabled', 'hover', 'light', 'lighter', 'dark'];

const colors = [
	{
		primary: colorSubGroups,
		bg: colorSubGroups,
		text: colorSubGroups,
		stroke: colorSubGroups,
		icon: colorSubGroups,
		error: colorSubGroups,
		success: colorSubGroups
	}
];

const spacing = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];

export const twMerge = extendTailwindMerge({
	extend: {
		theme: {
			color: colors,
			spacing,
			shadow: spacing
		},
		classGroups: {
			'font-size': [{ text: [validators.isInteger] }],
			'text-color': [{ text: colors }]
		}
	}
});
