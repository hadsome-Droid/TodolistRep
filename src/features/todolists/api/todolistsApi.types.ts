import { FilterValuesType } from "../model/reducer/todolists/todolists-reducer.ts"

export type Todolist = {
    id: string
    title: string
    addedDate: string
    order: number
}

export type DomainTodolist = Todolist & {
    filter: FilterValuesType
}
