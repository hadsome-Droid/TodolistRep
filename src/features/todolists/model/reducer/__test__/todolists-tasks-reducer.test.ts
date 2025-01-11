import {TasksStateType, TodolistType} from "../../../../../App.tsx";
import {addTodolistAC, todolistsSlice} from "../todolists/todolistsSlice.ts";
import {tasksReducer} from "../tasks/tasksSlice.ts";

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {}
    const startTodolistsState: TodolistType[] = []

    const action = addTodolistAC('new todolist')

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsSlice(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.todolistId)
    expect(idFromTodolists).toBe(action.payload.todolistId)
})