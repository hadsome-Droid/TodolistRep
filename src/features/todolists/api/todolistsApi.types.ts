import { FilterValuesType } from "../model/reducer/todolists/todolistsSlice.ts"
import { RequestStatus } from "../../../app/appSlice.ts"

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
