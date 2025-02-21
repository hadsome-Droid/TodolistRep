import { ChangeEvent } from "react"
import { Checkbox, IconButton } from "@mui/material"
import { EditableSpan } from "../../../../../../../common/components/editableSpan/EditableSpan.tsx"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import ListItem from "@mui/material/ListItem"
import { getListItemSx } from "./Task.styles.ts"
import { DomainTask, UpdateTaskModel } from "../../../../../api/tasks/tasksApi.types.ts"
import { DomainTodolist } from "../../../../../api/todolistsApi.types.ts"
import { TaskStatus } from "../../../../../../../common/enums/enums.ts"
import { useRemoveTaskMutation, useUpdateTaskMutation } from "../../../../../api/tasks/tasks.Api.ts"

type Props = {
  task: DomainTask
  todolist: DomainTodolist
}

export const Task = ({ task, todolist }: Props) => {
  const [updateTask] = useUpdateTaskMutation()
  const [removeTask] = useRemoveTaskMutation()

  const changeTaskTitle = (title: string) => {
    const model: UpdateTaskModel = {
      status: task.status,
      title,
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate
    }
    updateTask({ todolistId: todolist.id, taskId: task.id, model })
  }

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New

    const model: UpdateTaskModel = {
      status,
      title: task.title,
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate
    }

    updateTask({ taskId: task.id, model, todolistId: todolist.id })
  }

  const handleRemoveTask = () => {
    removeTask({ todolistId: todolist.id, taskId: task.id })
  }

  const disabled = todolist.entityStatus === "loading"

  return (
    <ListItem
      key={task.id}
      className={task.status === TaskStatus.Completed ? "is-done" : ""}
      sx={getListItemSx(task.status === TaskStatus.Completed)}
    >
      <div>
        <Checkbox
          checked={task.status === TaskStatus.Completed}
          onChange={changeTaskStatusHandler}
          disabled={disabled}
        />
        <EditableSpan value={task.title} onChange={changeTaskTitle} disabled={disabled} />
      </div>
      <IconButton onClick={handleRemoveTask} disabled={disabled}>
        <DeleteForeverIcon />
      </IconButton>
    </ListItem>
  )
}
