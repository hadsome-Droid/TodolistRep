import {useTodolistsStore} from "./todolists-zustan.ts";

test('test', () => {
    const test = useTodolistsStore()

    expect(test.todolists.length).toBe(2)
})

