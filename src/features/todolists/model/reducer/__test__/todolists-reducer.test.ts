import {v4 as uuidv4} from "uuid";
import {TodolistType} from "../../../../../App.tsx";
import {
    addTodolistAC,
    changeTodolistFilterAC,
    removeTodolistAC,
    todolistsSlice,
    updateTodolistTitleAC
} from "../todolists/todolistsSlice.ts";

let todolistId1: string
let todolistId2: string
let startState: TodolistType[] = []

beforeEach(() => {
    todolistId1 = uuidv4()
    todolistId2 = uuidv4()

    startState = [
        {id: todolistId1, title: 'What to learn', filter: 'all'},
        {id: todolistId2, title: 'What to buy', filter: 'all'},
    ]
})

test('two plus two is four', () => {
    expect(2 + 2).toBe(4);
})

test('correct todolist should be removed', () => {

    // 2. Действие
    const action = {
        type: 'REMOVE-TODOLIST',
        payload: {
            id: todolistId1
        },
    } as const
    const endState = todolistsSlice(startState, removeTodolistAC(todolistId1))

    // 3. Проверяем, что наши действия (изменения state) соответствуют ожиданию
    // в массиве останется один тудулист
    expect(endState.length).toBe(1)
    // удалится нужный тудулист, а не любой
    expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {

    // const action = {
    //     type: 'ADD-TODOLIST',
    //     payload: {
    //         title: 'New Todolist',
    //     },
    // } as const
    const endState = todolistsSlice(startState, addTodolistAC('New Todolist'))

    expect(endState.length).toBe(3)
    expect(endState[2].title).toBe('New Todolist')
})

test('correct todolist should change its name', () => {

    const newTitle = 'New Todolist'

    const endState = todolistsSlice(
        startState,
        updateTodolistTitleAC({id: todolistId2, title: newTitle})
    )

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe('New Todolist')
})

test('correct filter of todolist should be changed', () => {

    const endState = todolistsSlice(startState, changeTodolistFilterAC({id: todolistId2, filter: 'completed'}))

    expect(endState[0].filter).toBe('all')
    expect(endState[1].filter).toBe('completed')
})