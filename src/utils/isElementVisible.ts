export function isElementVisible(node: unknown) {
	if (!(node instanceof HTMLElement)) {
		return false;
	}

	const elements: HTMLElement[] = [node];

	if (node.parentElement) {
		elements.push(node.parentElement);
	}

	return elements.some(v => v.offsetWidth || v.offsetHeight || v.getClientRects().length);
}
