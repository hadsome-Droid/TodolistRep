import './App.css'
import CssBaseline from '@mui/material/CssBaseline'
import {ThemeProvider} from '@mui/material/styles'
// import {useTodolistsStore} from "./model/zust/todolists-zustan.ts";
import {getTheme} from "./common/theme/theme.ts";
import {Header} from "./common/components/header/Header.tsx";
import {Main} from "./app/main/Main.tsx";
import {useAppSelector} from "./common/hooks/useAppSelector.ts";
import {selectThemeMode} from "./app/appSelectors.ts";
import {useEffect} from "react";

import {todolistsApi} from "./features/todolists/api/todolistsApi.ts";



function App() {
    // const test = useTodolistsStore()

    const themeMode = useAppSelector(selectThemeMode)
    const updateTitleTodolistHandler = () => {
        const todolistId = '1a54ca5f-f453-4604-996a-1f423808acf6'
        const title = 'New old repeat todolist title'
        todolistsApi.updateTodolist({id: todolistId, title}).then(res => {
            console.log(res)
        })
    }

useEffect(() => {
   todolistsApi.getTodolists()
        .then(res => {
            console.log(res.data)
        })
}, [])

    return (
        <ThemeProvider theme={getTheme(themeMode)}>
            <CssBaseline/>
            <Header/>
            <button onClick={updateTitleTodolistHandler}>Update Title Todolist</button>
            <Main/>
        </ThemeProvider>
    )
}

export default App
