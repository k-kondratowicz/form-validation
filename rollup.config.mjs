import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

const bundle = config => ({
	...config,
	input: 'src/index.ts',
	external: id => !/^[./]/.test(id),
});

export default [
	bundle({
		plugins: [
			esbuild({
				target: 'es2020',
				tsconfig: 'tsconfig.json',
			}),
		],
		output: [
			{
				file: 'dist/index.cjs',
				format: 'cjs',
				sourcemap: true,
			},
		],
	}),
	bundle({
		plugins: [
			esbuild({
				target: 'es2020',
				tsconfig: 'tsconfig.json',
			}),
		],
		output: [
			{
				file: 'dist/index.mjs',
				format: 'es',
				sourcemap: true,
			},
		],
	}),
	bundle({
		plugins: [
			dts({
				tsconfig: 'tsconfig.json',
			}),
		],
		output: {
			file: `dist/index.d.ts`,
			format: 'es',
		},
	}),
];
