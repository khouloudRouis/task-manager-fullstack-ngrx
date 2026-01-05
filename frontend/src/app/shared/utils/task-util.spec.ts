import { Task } from "../../core/models/task"
import { TaskUtils } from "./task-util";

describe('TaskUtils', () => {
    describe('should return last element when lastTask is called', () => {
        it('should return the last element', () => {
            const tasks = [{ title: 'task 1' }, { title: 'task 2' }] as Task[];
            const result = TaskUtils.lastTask(tasks);
            expect(result).toEqual({ title: 'task 2' } as Task);
        });
        it('should return the last element', () => {
            const tasks = [] as Task[];
            const result = TaskUtils.lastTask(tasks);
            expect(result).toEqual(undefined);
        });
    });
    describe('should return order when calculateOrder is called', () => {
        const tasks = [{ title: 'task 1', order: 100 }, { title: 'task 2', order: 200 }] as Task[];
        const testCases: { input1?: Task, input2?: Task, expected: number }[] = [
            { expected: 100 },
            { input1: tasks[0], input2: tasks[1], expected: 150 },
            { input1: tasks[0], expected: 200 },
            { input2: tasks[1], expected: 100 },
        ];

        testCases.forEach(({ input1, input2, expected }) => {
            it(`should return ${expected} when input is ${input1} ,${input2}`, () => {
                const result = TaskUtils.calculateOrder(input1, input2);
                expect(result).toEqual(expected);
            });
        });

    });
})