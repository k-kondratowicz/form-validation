export function isEmpty(v: any) {
	return [Object, Array].includes((v || {}).constructor) && !Object.entries(v || {}).length;
}
