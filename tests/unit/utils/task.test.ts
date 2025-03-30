import { Task } from '@/utils';

describe('Task', () => {
	it('should resolve the task', async () => {
		const task = new Task<string>();

		const result = 'Task resolved';
		task.resolve(result);

		const resolvedValue = await task;

		expect(resolvedValue).toBe(result);
		expect(task.resolved).toBe(true);
		expect(task.rejected).toBe(false);
		expect(task.finished).toBe(true);
	});

	it('should reject the task', async () => {
		const task = new Task<string>();

		const error = new Error('Task rejected');
		task.reject(error);

		try {
			await task;
		} catch (rejectedValue) {
			expect(rejectedValue).toBe(error);
			expect(task.resolved).toBe(false);
			expect(task.rejected).toBe(true);
			expect(task.finished).toBe(true);
		}
	});
});
