import { ChangeEvent } from "react"
import { Checkbox, IconButton } from "@mui/material"
import { EditableSpan } from "../../../../../../../common/components/editableSpan/EditableSpan.tsx"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import ListItem from "@mui/material/ListItem"
import {
  changeTaskStatusAC,
  changeTaskTitleAC,
  removeTaskAC,
  removeTaskTC, updateTaskTC
} from "../../../../../model/reducer/tasks/tasksReducer.ts"
import { getListItemSx } from "./Task.styles.ts"
import { useAppDispatch } from "../../../../../../../common/hooks/useAppDispatch.ts"
import { DomainTask } from "../../../../../api/tasks/tasksApi.types.ts"
import { DomainTodolist } from "../../../../../api/todolistsApi.types.ts"
import { TaskStatus } from "../../../../../../../common/enums/enums.ts"
// import {EditableSpan} from "common/components";

type Props = {
  task: DomainTask
  todolist: DomainTodolist
}

export const Task = ({ task, todolist }: Props) => {
  const dispatch = useAppDispatch()

  const changeTaskTitle = (title: string) => {
    dispatch(updateTaskTC({ todolistId: todolist.id, taskId: task.id, domainModel: { title } }))
  }

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    dispatch(updateTaskTC({ taskId: task.id, domainModel: { status }, todolistId: todolist.id }))
  }

  const removeTask = () => {
    dispatch(removeTaskTC({ todolistId: todolist.id, taskId: task.id }))
  }

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
        />
        <EditableSpan value={task.title} onChange={changeTaskTitle} />
      </div>
      <IconButton onClick={removeTask}>
        <DeleteForeverIcon />
      </IconButton>
    </ListItem>
  )
}
