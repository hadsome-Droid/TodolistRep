import './App.css'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container';
import Grid2 from '@mui/material/Grid2';
import Paper from '@mui/material/Paper'
import Switch from '@mui/material/Switch'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import {FilterValuesType, Todolist} from "./components/todolist/Todolist.tsx";
import {useReducer, useState} from "react";
import {v4 as uuidv4} from 'uuid';
import {AddItemForm} from "./components/AdditemForm.tsx";
import {useTodolistsStore} from "./model/zust/todolists-zustan.ts";
import {
    addTodolistAC, changeTodolistFilterAC,
    initialState, removeTodolistAC,
    todolistsReducer,
    updateTodolistTitleAC
} from "./model/reducer/todolists/todolists-reducer.ts";
import {MenuButton} from "./components/MenuButton.tsx";


export type TaskProps = {
    id: string,
    title: string,
    isDone: boolean,
}

export type TodolistType = {
    id: string,
    title: string,
    filter: FilterValuesType,
}

export type TasksStateType = {
    [key: string]: TaskProps[]
}

type ThemeMode = 'dark' | 'light'

function App1() {
    const test = useTodolistsStore()
    const [themeMode, setThemeMode] = useState<ThemeMode>('dark')

    const theme = createTheme({
        palette: {
            mode: themeMode === 'dark' ? 'dark' : 'light',
            primary: {
                main: '#087EA4',
            },
        },
    })

    const todolistId1 = uuidv4()
    const todolistId2 = uuidv4()

    const [todolist2, dispatch] = useReducer(todolistsReducer, initialState)

    const tasksList = {
        [todolistId1]: [
            {id: uuidv4(), title: 'HTML&CSS', isDone: true},
            {id: uuidv4(), title: 'JS', isDone: true},
            {id: uuidv4(), title: 'ReactJS', isDone: false},
            {id: uuidv4(), title: 'Redux', isDone: false},
            {id: uuidv4(), title: 'Typescript', isDone: false},
            {id: uuidv4(), title: 'RTK query', isDone: false},
        ],
        [todolistId2]: [
            {id: uuidv4(), title: 'Black', isDone: true},
            {id: uuidv4(), title: 'Silver', isDone: true},
            {id: uuidv4(), title: 'RED', isDone: false},
            {id: uuidv4(), title: 'Blue', isDone: false},
            {id: uuidv4(), title: 'Green', isDone: false},
            {id: uuidv4(), title: 'Yellow', isDone: false},
        ]
    }

    const [todolists, setTodolists] = useState<TodolistType[]>([
        {id: todolistId1, title: 'What to learn', filter: 'all'},
        {id: todolistId2, title: 'Song of live', filter: 'all'},
    ])

    const [tasks, setTasks] = useState<TasksStateType>(tasksList)

    const addTask = (todolistId: string, title: string) => {
        const newTask: TaskProps = {
            id: uuidv4(),
            title: title,
            isDone: false,
        }
        setTasks({...tasks, [todolistId]: [newTask, ...tasks[todolistId]]})
    }

    const removeTask = (todolistId: string, taskId: string) => {
        const filteredTasks: TasksStateType = {
            ...tasks,
            [todolistId]: tasks[todolistId].filter((task: TaskProps) => task.id !== taskId)
        }
        setTasks(filteredTasks)
    }

    const changeTaskStatus = (todolistId: string, taskId: string, isDone: boolean) => {
        const task = {
            ...tasks,
            [todolistId]: tasks[todolistId].map((t: TaskProps) => {
                return t.id === taskId ? {...t, isDone: isDone} : t
            })
        }
        setTasks(task)
    }

    const updateTaskTitle = (todolistId: string, taskId: string, title: string) => {
        setTasks({
            ...tasks,
            [todolistId]: tasks[todolistId].map((task) => task.id === taskId ? {...task, title} : task)
        })
    }

    const changeFilter = (todolistId: string, filter: FilterValuesType) => {
        setTodolists(todolists.map((todo) => todo.id === todolistId ? {...todo, filter} : todo))
        // changeTodolistFilterAC(todolistId, filter)
    }

    const removeTodolist = (todolistId: string) => {
        setTodolists(todolists.filter((todo) => todo.id !== todolistId))
        // removeTodolistAC(todolistId)
        delete tasks[todolistId]
        setTasks({...tasks})
    }

    const addTodolist = (title: string) => {
        const todolistId = uuidv4()
        const newTodolist: TodolistType = {id: todolistId, title: title, filter: 'all'}
        setTodolists([newTodolist, ...todolists])
        // addTodolistAC(todolistId, title)
        setTasks({...tasks, [todolistId]: []})
    }

    const updateTodolistTitle = (todolistId: string, title: string) => {
        setTodolists(todolists.map((todo) => todo.id === todolistId ? {...todo, title} : todo))
        // updateTodolistTitleAC(todolistId, title)
    }

    const changeModeHandler = () => {
        setThemeMode(themeMode == 'dark' ? 'light' : 'dark')
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Container fixed>
                <Grid2 container>
                    <AppBar position="static" sx={{mb: '30px'}}>
                        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <IconButton color="inherit">
                                <MenuIcon/>
                            </IconButton>
                            <div>
                                <MenuButton>Login</MenuButton>
                                <MenuButton>Logout</MenuButton>
                                <MenuButton background={'aqua'}>Faq</MenuButton>
                                <Switch color={'default'} onChange={changeModeHandler} />
                            </div>
                        </Toolbar>
                    </AppBar>
                </Grid2>

                <Grid2 container sx={{mb: '30px'}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid2>
                <Grid2 container spacing={4}>
                    {todolists.map((todolist) => {
                        return (
                            <Grid2>
                                <Paper sx={{ p: '0 20px 20px 20px' }}>
                                    <Todolist
                                        key={todolist.id}
                                        todolistId={todolist.id}
                                        title={todolist.title}
                                        tasks={tasks}
                                        removeTask={removeTask}
                                        addTask={addTask}
                                        changeTaskStatus={changeTaskStatus}
                                        filter={todolist.filter}
                                        changeFilter={changeFilter}
                                        removeTodolist={removeTodolist}
                                        updateTaskTitle={updateTaskTitle}
                                        updateTodolistTitle={updateTodolistTitle}
                                    />
                                </Paper>
                            </Grid2>
                        )
                    })}
                </Grid2>
            </Container>
        </ThemeProvider>
    )
}

export default App
