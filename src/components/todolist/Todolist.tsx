import {TaskProps, TasksStateType} from "../../App.tsx";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
// import {Button} from "./Button.tsx";
// import {ChangeEvent, KeyboardEvent, useState} from "react";
import {AddItemForm} from "../AdditemForm.tsx";
import {EditableSpan} from "../EditableSpan.tsx";
import {Checkbox, IconButton} from "@mui/material";
import Button from "@mui/material/Button";
import Box from '@mui/material/Box'
import {filterButtonsContainerSx, getListItemSx} from "./Todolist.styles.ts";

export type FilterValuesType = 'all' | 'active' | 'completed'

type Props = {
    todolistId: string
    title: string
    tasks: TasksStateType
    date?: string
    removeTask: (todolistId: string, taskId: string) => void
    addTask: (todolistId: string, title: string) => void
    changeTaskStatus: (todolistId: string, taskId: string, isDone: boolean) => void
    filter: FilterValuesType,
    changeFilter: (todolistId: string, filter: FilterValuesType) => void
    removeTodolist: (todolistId: string) => void
    updateTaskTitle: (todolistId: string, taskId: string, title: string) => void
    updateTodolistTitle: (todolistId: string, title: string) => void
}

export const Todolist = ({
                             todolistId,
                             title,
                             tasks,
                             date,
                             removeTask,
                             addTask,
                             changeTaskStatus,
                             filter,
                             changeFilter,
                             removeTodolist,
                             updateTaskTitle,
                             updateTodolistTitle
                         }: Props) => {
    // const [filter, setFilter] = useState<FilterValuesType>('all')
    // const inputRef = useRef<HTMLInputElement>(null)

    let tasksForTodolist = tasks[todolistId]
    console.log(tasks)
    if (filter === 'active') {
        tasksForTodolist = tasks[todolistId].filter(task => !task.isDone)
    }

    if (filter === 'completed') {
        tasksForTodolist = tasks[todolistId].filter(task => task.isDone)
    }

    const addTaskCallback = (title: string) => {
        addTask(todolistId, title)
    }

    const handlerRemoveTodolist = () => {
        removeTodolist(todolistId)
    }

    const updateTodolistTitleHandler = (title: string) => {
        updateTodolistTitle(todolistId, title)
    }
    return (
        <div>
            <div className={'todolist-title-container'}>
                <h3>
                    <EditableSpan value={title} onChange={updateTodolistTitleHandler}/>
                </h3>
                {/*<Button title={'x'} onClick={handlerRemoveTodolist}/>*/}
                <IconButton onClick={handlerRemoveTodolist}>
                    <DeleteForeverIcon/>
                </IconButton>
            </div>
            <AddItemForm addItem={addTaskCallback}/>
            <ul>

                {tasksForTodolist.length === 0
                    ? (<p>Тасок нет</p>)
                    : (
                        <List>
                            {tasksForTodolist.map((task: TaskProps) => {
                                const changeTaskTitleHandler = (title: string) => {
                                    updateTaskTitle(todolistId, task.id, title)
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
                                                onChange={(e) => {
                                                    const newStatusValue = e.currentTarget.checked
                                                    changeTaskStatus(todolistId, task.id, newStatusValue)
                                                }}
                                            />
                                            <EditableSpan value={task.title} onChange={changeTaskTitleHandler}/>
                                        </div>
                                        <IconButton onClick={() => removeTask(todolistId, task.id)}>
                                            <DeleteForeverIcon/>
                                        </IconButton>
                                    </ListItem>
                                )
                            })}
                        </List>
                    )}
            </ul>
            <Box sx={filterButtonsContainerSx}>
                <Button
                    variant={filter === 'all' ? 'outlined' : 'text'}
                    color={'inherit'}
                    onClick={() => changeFilter(todolistId, 'all')}
                >
                    All
                </Button>
                <Button
                    variant={filter === 'active' ? 'outlined' : 'text'}
                    color={'primary'}
                    onClick={() => changeFilter(todolistId, 'active')}
                >
                    Active
                </Button>
                <Button
                    variant={filter === 'completed' ? 'outlined' : 'text'}
                    color={'secondary'}
                    onClick={() => changeFilter(todolistId, 'completed')}
                >
                    Completed
                </Button>
            </Box>
            <span>{date}</span>
        </div>
    )
}