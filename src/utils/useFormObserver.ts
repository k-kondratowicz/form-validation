export function useFormObserver(form: HTMLFormElement, cb: MutationCallback) {
	const observer = new MutationObserver(cb);

	observer.observe(form, {
		childList: true,
		subtree: true,
	});

	return observer;
}
