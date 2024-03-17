export function createElement(tag = 'div', width = 0, height = 0, hidden = false) {
	const el = document.createElement(tag);

	Object.assign(el.style, {
		width: `${width}px`,
		height: `${height}px`,
		display: hidden ? 'none' : 'block',
	});

	const rect: DOMRect = {
		x: 0,
		y: 0,
		width,
		height,
		top: 0,
		right: width,
		bottom: height,
		left: 0,
		toJSON: () => '',
	};

	el.getBoundingClientRect = () => rect;

	if (!hidden) {
		el.getClientRects = () => ({ 0: rect, length: 1 }) as unknown as DOMRectList;
	}

	return el;
}
