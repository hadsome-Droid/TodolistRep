import {AddItemForm} from "../../../../../common/components/addItemForm/AdditemForm.tsx";
import {FilterTasksButtons} from "./filterTasksButton/FilterTasksButtons.tsx";
import {Tasks} from "./tasks/Tasks.tsx";
import {TodolistTitle} from "./todolistTitle/TodolistTitle.tsx";
import { addTask, createTaskTC } from "../../../model/reducer/tasks/tasksSlice.ts"
import {useAppDispatch} from "../../../../../common/hooks/useAppDispatch.ts";
import { DomainTodolist } from "../../../api/todolistsApi.types.ts"

type Props = {
    todolist: DomainTodolist
    date?: string
}

export const Todolist = (props: Props) => {
    const {date, todolist} = props
    const dispatch = useAppDispatch();

    const addTaskCallback = (title: string) => {
        // dispatch(createTaskTC({todolistId: todolist.id, title}))
        dispatch(addTask({todolistId: todolist.id, title}))
    }

    return (
        <div>
            <TodolistTitle todolist={todolist}/>
            <AddItemForm addItem={addTaskCallback} disabled={todolist.entityStatus === 'loading'}/>
            <Tasks todolist={todolist}/>
            <FilterTasksButtons todolist={todolist}/>
            <span>{date}</span>
        </div>
    )
}