import {EditableSpan} from "../../../../../../common/components/editableSpan/EditableSpan.tsx";
import {IconButton} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
    removeTodolistAC,
    TodolistType,
    updateTodolistTitleAC
} from "../../../../model/reducer/todolists/todolists-reducer.ts";
import {useAppDispatch} from "../../../../../../common/hooks/useAppDispatch.ts";


type Props = {
    todolist: TodolistType
}

export const TodolistTitle = ({todolist}: Props) => {
    const dispatch = useAppDispatch();

    const handlerRemoveTodolist = () => {
        dispatch(removeTodolistAC(todolist.id))
    }

    const updateTodolistTitleHandler = (title: string) => {
        dispatch(updateTodolistTitleAC({id: todolist.id, title}))
    }

    return (
        <div className={'todolist-title-container'}>
            <h3>
                <EditableSpan value={todolist.title} onChange={updateTodolistTitleHandler}/>
            </h3>
            <IconButton onClick={handlerRemoveTodolist}>
                <DeleteForeverIcon/>
            </IconButton>
        </div>
    );
};
