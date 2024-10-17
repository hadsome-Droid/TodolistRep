import {v4 as uuidv4} from "uuid";
import {TodolistType} from "../../../App.tsx";
import {FilterValuesType} from "../../../components/todolist/Todolist.tsx";

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST'
    payload: {
        id: string
    }
}

export type AddTodolistActionType = {
    type: 'ADD-TODOLIST'
    payload: {
        todolistId: string
        title: string
    }
}

export type ChangeTodolistTitleActionType = {
    type: 'UPDATE-TODOLIST-TITLE'
    payload: {
        id: string
        title: string
    }
}

export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER'
    payload: {
        id: string
        filter: FilterValuesType
    }
}

type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType

const todolistId1 = uuidv4()
const todolistId2 = uuidv4()

const initialState: TodolistType[] = [
    {id: todolistId1, title: 'What to learn', filter: 'all'},
    {id: todolistId2, title: 'Song of live', filter: 'all'},
]

export const todolistsReducer = (state: TodolistType[] = initialState, action: ActionsType) => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter((todo) => todo.id !== action.payload.id)
        }
        case 'ADD-TODOLIST': {
            // const newTodolist = {id: uuidv4(), title: action.payload.title, filter: 'all'}
            const newTodolist = {id: action.payload.todolistId, title: action.payload.title, filter: 'all'}
            return [
                ...state,
                newTodolist,
            ]
        }
        case 'UPDATE-TODOLIST-TITLE': {
            return state.map((todo) => todo.id === action.payload.id ? {...todo, title: action.payload.title} : todo)
        }
        case 'CHANGE-TODOLIST-FILTER': {
            return state.map((todo) => todo.id === action.payload.id ? {...todo, filter: action.payload.filter} : todo)
        }
        default:
            throw new Error("I don't understand this type")
    }
}

export const removeTodolistAC = (todolistId: string) => {
    return {type: 'REMOVE-TODOLIST', payload: {id: todolistId}} as const
}

export const addTodolistAC = (title: string) => {
    return {type: 'ADD-TODOLIST', payload: {todolistId: uuidv4(), title}} as const
}

export const updateTodolistTitleAC = (todolistId: string, newTitle: string) => {
    return {type: 'UPDATE-TODOLIST-TITLE', payload: {id: todolistId, title: newTitle}} as const
}

export const changeTodolistFilterAC = (todolistId: string, filter: FilterValuesType) => {
    return {type: 'CHANGE-TODOLIST-FILTER', payload: {id: todolistId, filter}} as const
}