import './App.css'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container';
import Grid2 from '@mui/material/Grid2';
import Paper from '@mui/material/Paper'
import Switch from '@mui/material/Switch'
import CssBaseline from '@mui/material/CssBaseline'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import {FilterValuesType, Todolist} from "./components/todolist/Todolist.tsx";
import {useReducer, useState} from "react";
import {v4 as uuidv4} from 'uuid';
import {AddItemForm} from "./components/AdditemForm.tsx";
import {useTodolistsStore} from "./model/zust/todolists-zustan.ts";
import {
    addTodolistAC, changeTodolistFilterAC,
    removeTodolistAC,
    todolistsReducer,
    updateTodolistTitleAC
} from "./model/reducer/todolists/todolists-reducer.ts";
import {MenuButton} from "./components/MenuButton.tsx";
import {
    addTackAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC,
    tasksReducer
} from "./model/reducer/tasks/tasksReducer.ts";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./app/store.ts";

export type FilterValuesType = 'all' | 'active' | 'completed'

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
    [key: string]: Array<TaskProps>
}

type ThemeMode = 'dark' | 'light'

function App() {
    const test = useTodolistsStore()
    const todolists = useSelector<RootState, TodolistType[]>(state => state.todolists)
    const tasks = useSelector<RootState, TasksStateType>(state => state.tasks)
    const dispatch = useDispatch()


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

    // const [todolists, dispathToTodolists] = useReducer(todolistsReducer, [
    //     {id: todolistId1, title: 'What to learn', filter: 'all'},
    //     {id: todolistId2, title: 'Song of live', filter: 'all'},
    // ])

    // const [tasks, dispatchToTasks] = useReducer(tasksReducer, tasksList)

    const addTask = (todolistId: string, title: string) => {
        dispatch(addTackAC({todolistId, title}))
    }

    const removeTask = (todolistId: string, taskId: string) => {
        dispatch(removeTaskAC({todolistId, taskId}))
    }

    const changeTaskStatus = (todolistId: string, taskId: string, isDone: boolean) => {

        dispatch(changeTaskStatusAC({todolistId, taskId, isDone}))
    }

    const updateTaskTitle = (todolistId: string, taskId: string, title: string) => {
        dispatch(changeTaskTitleAC({todolistId, taskId, title}))
    }

    const changeFilter = (todolistId: string, filter: FilterValuesType) => {
        dispatch(changeTodolistFilterAC({todolistId, filter}))
    }

    const removeTodolist = (todolistId: string) => {
        const action = removeTodolistAC(todolistId)
        dispatch(action)
    }

    const addTodolist = (title: string) => {
        const action = addTodolistAC(title)
        dispatch(action)
    }

    const updateTodolistTitle = (todolistId: string, newTitle: string) => {
        dispatch(updateTodolistTitleAC({id: todolistId, title: newTitle}))
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
                        <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                            <IconButton color="inherit">
                                <MenuIcon/>
                            </IconButton>
                            <div>
                                <MenuButton>Login</MenuButton>
                                <MenuButton>Logout</MenuButton>
                                <MenuButton background={'aqua'}>Faq</MenuButton>
                                <Switch color={'default'} onChange={changeModeHandler}/>
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
                            <Grid2 key={todolist.id}>
                                <Paper sx={{p: '0 20px 20px 20px'}}>
                                    <Todolist
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
