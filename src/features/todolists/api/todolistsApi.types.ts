import { RequestStatus } from "../../../app/appSlice.ts"
import { FilterValuesType } from "../lib/types/types.ts"

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
