import { FilterValuesType } from "../model/reducer/todolists/todolists-reducer.ts"
import { RequestStatus } from "../../../app/app-reducer.ts"

export type Todolist = {
    id: string
    title: string
    addedDate: string
    order: number
}

export type DomainTodolist = Todolist & {
    filter: FilterValuesType
    entityStatus: RequestStatus
}
