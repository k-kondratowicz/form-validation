import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';

const tsconfig = 'tsconfig.json';

const bundle = config => ({
	input: 'src/index.ts',
	external: ['lodash'],
	...config,
});

const sharedPlugins = [
	typescriptPaths({
		tsConfigPath: tsconfig,
		preserveExtensions: true,
	}),
	esbuild({
		target: 'es2020',
		tsconfig,
	}),
	resolve(),
	commonjs(),
];

export default [
	bundle({
		plugins: [...sharedPlugins],
		output: [
			{
				file: 'dist/index.cjs.js',
				format: 'cjs',
				sourcemap: true,
			},
		],
	}),

	bundle({
		plugins: [...sharedPlugins],
		output: [
			{
				file: 'dist/index.esm.js',
				format: 'es',
				sourcemap: true,
			},
		],
	}),

	bundle({
		plugins: [...sharedPlugins, optimizeLodashImports(), terser()],
		output: [
			{
				file: 'dist/index.umd.js',
				format: 'umd',
				name: 'FormValidation',
				esModule: false,
				exports: 'named',
				sourcemap: true,
			},
		],
	}),

	bundle({
		plugins: [
			typescriptPaths({
				tsConfigPath: tsconfig,
				preserveExtensions: true,
			}),
			dts({
				tsconfig,
			}),
		],
		output: {
			file: `dist/index.d.ts`,
			format: 'es',
		},
	}),
];
