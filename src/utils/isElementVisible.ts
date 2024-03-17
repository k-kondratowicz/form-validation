export function isElementVisible(node: unknown) {
	if (!(node instanceof HTMLElement)) {
		return false;
	}

	const isVisible = !!(node.offsetWidth || node.offsetHeight || node.getClientRects().length);

	if ('checkVisibility' in node) {
		return isVisible && node.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
	}

	return isVisible;
}
