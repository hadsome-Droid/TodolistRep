import {EditableSpan} from "../../../../../../common/components/editableSpan/EditableSpan.tsx";
import {IconButton} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  deleteTodolistTC,
  removeTodolistAC, updateTodolistTC,
  updateTodolistTitleAC
} from "../../../../model/reducer/todolists/todolists-reducer.ts"
import {useAppDispatch} from "../../../../../../common/hooks/useAppDispatch.ts";
import { DomainTodolist } from "../../../../api/todolistsApi.types.ts"
import { ResultCode } from "common/enums/enums.ts"


type Props = {
    todolist: DomainTodolist
}

export const TodolistTitle = ({todolist}: Props) => {

    const dispatch = useAppDispatch();

    const handlerRemoveTodolist = () => {
        dispatch(deleteTodolistTC(todolist.id))
    }

    const updateTodolistTitleHandler = (title: string) => {
        dispatch(updateTodolistTC({todolistId: todolist.id, title}))
    }

    return (
        <div className={'todolist-title-container'}>
            <h3>
                <EditableSpan value={todolist.title} onChange={updateTodolistTitleHandler} disabled={todolist.entityStatus === 'loading'}/>
            </h3>
            <IconButton onClick={handlerRemoveTodolist} disabled={todolist.entityStatus === 'loading'}>
                <DeleteForeverIcon/>
            </IconButton>
        </div>
    );
};
