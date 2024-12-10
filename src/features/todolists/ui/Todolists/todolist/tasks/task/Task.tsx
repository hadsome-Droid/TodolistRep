import {ChangeEvent} from 'react';
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "../../../../../../../common/components/editableSpan/EditableSpan.tsx";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ListItem from "@mui/material/ListItem";
import {
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC,
    TaskProps
} from "../../../../../model/reducer/tasks/tasksReducer.ts";
import {TodolistType} from "../../../../../model/reducer/todolists/todolists-reducer.ts";
import {getListItemSx} from "./Task.styles.ts";
import {useAppDispatch} from "../../../../../../../common/hooks/useAppDispatch.ts";
// import {EditableSpan} from "common/components";

type Props = {
    task: TaskProps
    todolist: TodolistType
}

export const Task = ({task, todolist}: Props) => {
    const dispatch = useAppDispatch();

    const changeTaskTitle = (title: string) => {
        dispatch(changeTaskTitleAC({todolistId: todolist.id, taskId: task.id, title}))
    }

    const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const isDone = e.currentTarget.checked
        dispatch(changeTaskStatusAC({taskId: task.id, isDone, todolistId: todolist.id}))
    }

    const removeTask = (todolistId: string, taskId: string) => {
        dispatch(removeTaskAC({todolistId, taskId}))
    }

    return (
        <ListItem
            key={task.id}
            className={task.isDone ? 'is-done' : ''}
            sx={getListItemSx(task.isDone)}
        >
            <div>
                <Checkbox
                    checked={task.isDone}
                    onChange={changeTaskStatusHandler}
                />
                <EditableSpan value={task.title} onChange={changeTaskTitle}/>
            </div>
            <IconButton onClick={() => removeTask(todolist.id, task.id)}>
                <DeleteForeverIcon/>
            </IconButton>
        </ListItem>
    );
};
