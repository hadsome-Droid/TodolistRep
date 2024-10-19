import {AddItemForm} from "../../../../../common/components/addItemForm/AdditemForm.tsx";
import {TodolistType} from "../../../model/reducer/todolists/todolists-reducer.ts";
import {FilterTasksButtons} from "./filterTasksButton/FilterTasksButtons.tsx";
import {Tasks} from "./tasks/Tasks.tsx";
import {TodolistTitle} from "./todolistTitle/TodolistTitle.tsx";
import {addTackAC} from "../../../model/reducer/tasks/tasksReducer.ts";
import {useAppDispatch} from "../../../../../common/hooks/useAppDispatch.ts";

type Props = {
    todolist: TodolistType
    date?: string
}

export const Todolist = (props: Props) => {
    const {date, todolist} = props
    const dispatch = useAppDispatch();

    const addTaskCallback = (title: string) => {
        dispatch(addTackAC({todolistId: todolist.id, title}))
    }


    return (
        <div>
            <TodolistTitle todolist={todolist}/>
            <AddItemForm addItem={addTaskCallback}/>
            <Tasks todolist={todolist}/>
            <FilterTasksButtons todolist={todolist}/>
            <span>{date}</span>
        </div>
    )
}