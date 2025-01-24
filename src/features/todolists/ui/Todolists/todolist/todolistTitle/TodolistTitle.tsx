import { EditableSpan } from "../../../../../../common/components/editableSpan/EditableSpan.tsx"
import { IconButton } from "@mui/material"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import { useAppDispatch } from "../../../../../../common/hooks/useAppDispatch.ts"
import { DomainTodolist } from "../../../../api/todolistsApi.types.ts"
import { todolistsApi, useRemoveTodolistMutation, useUpdateTodolistMutation } from "../../../../api/todolistsApi.ts"
import { RequestStatus } from "../../../../../../app/appSlice.ts"

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const [removeTodolist] = useRemoveTodolistMutation()
  const [updateTodolist] = useUpdateTodolistMutation()
  const dispatch = useAppDispatch()

  const updateQueryData = (status: RequestStatus) => {
    dispatch(
      todolistsApi.util.updateQueryData("getTodolists", undefined, state => {
        const index = state.findIndex(tl => tl.id === todolist.id)
        if (index !== -1) {
          state[index].entityStatus = status
        }
      })
    )
  }

  const handlerRemoveTodolist = () => {
    updateQueryData("loading")
    removeTodolist(todolist.id)
      .unwrap()
      .catch(() => {
        updateQueryData("idle")
      })
  }

  const updateTodolistTitleHandler = (title: string) => {
    updateTodolist({ id: todolist.id, title })
  }

  return (
    <div className={"todolist-title-container"}>
      <h3>
        <EditableSpan value={todolist.title} onChange={updateTodolistTitleHandler}
                      disabled={todolist.entityStatus === "loading"} />
      </h3>
      <IconButton onClick={handlerRemoveTodolist} disabled={todolist.entityStatus === "loading"}>
        <DeleteForeverIcon />
      </IconButton>
    </div>
  )
}
