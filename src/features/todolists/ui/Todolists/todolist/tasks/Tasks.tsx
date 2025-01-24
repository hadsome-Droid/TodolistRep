import List from "@mui/material/List";
import {Task} from "./task/Task.tsx";
import { DomainTask } from "../../../../api/tasks/tasksApi.types.ts"
import { DomainTodolist } from "../../../../api/todolistsApi.types.ts"
import { TaskStatus } from "../../../../../../common/enums/enums.ts"
import { useGetTasksQuery } from "../../../../api/tasks/tasks.Api.ts"
import { TasksSkeleton } from "../skeletons/TaskSkeleton/TaskSkeleton.tsx"

type Props = {
    todolist: DomainTodolist
}

export const Tasks = ({ todolist}: Props) => {
    const {data, isLoading} = useGetTasksQuery(todolist.id)


    if (isLoading) {
        return <TasksSkeleton />
    }
    // let tasksForTodolist = tasks[todolist.id]
    let tasksForTodolist = data?.items


    if (todolist.filter === 'active') {
        tasksForTodolist = tasksForTodolist?.filter(task => task.status === TaskStatus.New)
    }

    if (todolist.filter === 'completed') {
        tasksForTodolist = tasksForTodolist?.filter(task => task.status === TaskStatus.Completed)
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