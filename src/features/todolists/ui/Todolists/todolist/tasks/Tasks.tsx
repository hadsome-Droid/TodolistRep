import List from "@mui/material/List";
import {Task} from "./task/Task.tsx";
import {useAppSelector} from "../../../../../../common/hooks/useAppSelector.ts";
import {selectTasks} from "../../../../model/reducer/tasksSelectors.ts";
import { DomainTask } from "../../../../api/tasks/tasksApi.types.ts"
import { DomainTodolist } from "../../../../api/todolistsApi.types.ts"
import { TaskStatus } from "../../../../../../common/enums/enums.ts"
import { useAppDispatch } from "../../../../../../common/hooks/useAppDispatch.ts"
import { useEffect } from "react"
import { fetchTasksTC } from "../../../../model/reducer/tasks/tasksSlice.ts"

type Props = {
    todolist: DomainTodolist
}

export const Tasks = ({ todolist}: Props) => {
    const tasks = useAppSelector(selectTasks);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchTasksTC(todolist.id))
    }, [])

    let tasksForTodolist = tasks[todolist.id]


    if (todolist.filter === 'active') {
        tasksForTodolist = tasks[todolist.id].filter(task => task.status === TaskStatus.New)
    }

    if (todolist.filter === 'completed') {
        tasksForTodolist = tasks[todolist.id].filter(task => task.status === TaskStatus.Completed)
    }


    return (
        <ul>
            {tasksForTodolist?.length === 0
                ? (<p>Тасок нет</p>)
                : (
                    <List>
                        {tasksForTodolist?.map((task: DomainTask) => {
                            return (
                              <Task key={task.id} task={task} todolist={todolist} />
                            )
                        })}
                    </List>
                )}
        </ul>
    );
};