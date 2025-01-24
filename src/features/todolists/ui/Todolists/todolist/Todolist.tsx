import { AddItemForm } from "../../../../../common/components/addItemForm/AdditemForm.tsx"
import { FilterTasksButtons } from "./filterTasksButton/FilterTasksButtons.tsx"
import { Tasks } from "./tasks/Tasks.tsx"
import { TodolistTitle } from "./todolistTitle/TodolistTitle.tsx"
import { DomainTodolist } from "../../../api/todolistsApi.types.ts"
import { useCreateTaskMutation } from "../../../api/tasks/tasks.Api.ts"

type Props = {
  todolist: DomainTodolist
  date?: string
}

export const Todolist = (props: Props) => {
  const { date, todolist } = props
  const [createTask] = useCreateTaskMutation()

  const addTaskCallback = (title: string) => {
    createTask({ todolistId: todolist.id, title })
  }

  return (
    <div>
      <TodolistTitle todolist={todolist} />
      <AddItemForm addItem={addTaskCallback} disabled={todolist.entityStatus === "loading"} />
      <Tasks todolist={todolist} />
      <FilterTasksButtons todolist={todolist} />
      <span>{date}</span>
    </div>
  )
}