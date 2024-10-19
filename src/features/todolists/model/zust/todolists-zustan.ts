import {create} from "zustand";
import {v4 as uuidv4} from "uuid";
import {TodolistType} from "../../../../App.tsx";

type StoreType = {
    todolists: TodolistType[]
    addTodolist: (todolistId: string, title: string) => void
    removeTodolist: (todolistId: string) => void
}

const todolistId1 = uuidv4()
const todolistId2 = uuidv4()

const initialState: TodolistType[] = [
    {id: todolistId1, title: 'What to learn', filter: 'all'},
    {id: todolistId2, title: 'Song of live', filter: 'all'},
]

export const useTodolistsStore = create<StoreType>((set) => ({
    todolists: initialState,
    addTodolist: (todolistId, title) => {
        set((state) => ({
            todolists: [
                {id: todolistId, title, filter: 'all'},
                ...state.todolists
            ]
        }))
    },
    removeTodolist: (todolistId) => {
        set((state) => ({
            todolists: state.todolists.filter((todo) => todo.id !== todolistId)
        }))
    },
}))