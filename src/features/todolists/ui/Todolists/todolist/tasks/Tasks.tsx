import List from "@mui/material/List";
import {TaskProps} from "../../../../../../App.tsx";
import {TodolistType} from "../../../../model/reducer/todolists/todolists-reducer.ts";
import {Task} from "./task/Task.tsx";
import {useAppSelector} from "../../../../../../common/hooks/useAppSelector.ts";
import {selectTasks} from "../../../../model/reducer/tasksSelectors.ts";

type Props = {
    todolist: TodolistType
}

export const Tasks = ({todolist}: Props) => {
    const tasks = useAppSelector(selectTasks);

    let tasksForTodolist = tasks[todolist.id]

    console.log(tasks)

    if (todolist.filter === 'active') {
        tasksForTodolist = tasks[todolist.id].filter(task => !task.isDone)
    }

    if (todolist.filter === 'completed') {
        tasksForTodolist = tasks[todolist.id].filter(task => task.isDone)
    }


    return (
        <ul>
            {tasksForTodolist.length === 0
                ? (<p>Тасок нет</p>)
                : (
                    <List>
                        {tasksForTodolist.map((task: TaskProps) => {
                            return (
                              <Task key={task.id} task={task} todolist={todolist} />
                            )
                        })}
                    </List>
                )}
        </ul>
    );
};