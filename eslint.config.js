import prettier from 'eslint-config-prettier';
import path from 'node:path';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	// `.claude/` holds transient agent worktrees. They are gitignored, but a
	// worktree checked out before the ignore rule applied would still break typed
	// linting — so exclude the directory explicitly.
	{ ignores: ['.claude/**', 'src/lib/server/db/migrations/**'] },
	js.configs.recommended,
	ts.configs.recommended,
	svelte.configs.recommended,
	prettier,
	svelte.configs.prettier,
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: {
			'no-undef': 'off',
			// `_foo` marks an intentionally unused binding; rest-sibling
			// destructuring (`const { a, ...rest } = x`) is an omit, not a leak.
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
					ignoreRestSiblings: true
				}
			]
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		},
		rules: {
			// Internal navigation uses app-local hrefs that are already resolved
			// at the call site (see `$lib/utils/navigate.ts` and the `buildUrl`
			// helpers in list pages); presentational components just forward them.
			'svelte/no-navigation-without-resolve': 'off'
		}
	},
	{
		// Guardrail: server-only modules must never be pulled into client code.
		// `$lib/server/**` is already blocked by SvelteKit at build time; this
		// makes the same mistake fail in the editor, before the build runs.
		// Type-only imports are fine — they are erased at compile time (that is
		// how `$lib/client` gets its `AppRouter` type).
		files: ['src/lib/components/**', 'src/lib/client/**', 'src/lib/utils/**'],
		rules: {
			'@typescript-eslint/no-restricted-imports': [
				'error',
				{
					patterns: [
						{
							group: ['$lib/server/*', '$lib/server'],
							allowTypeImports: true,
							message: 'Server-only code must not be imported from client-side modules. Go through tRPC instead.'
						}
					]
				}
			]
		}
	}
);
