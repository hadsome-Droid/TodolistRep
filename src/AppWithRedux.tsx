import "./App.css"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
// import {useTodolistsStore} from "./model/zust/todolists-zustan.ts";
import { getTheme } from "./common/theme/theme.ts"
import { Header } from "./common/components/header/Header.tsx"
import { Main } from "./app/main/Main.tsx"
import { useAppSelector } from "./common/hooks/useAppSelector.ts"
import { selectThemeMode } from "./app/appSelectors.ts"
import { useEffect } from "react"
import { todolistsApi } from "./features/todolists/api/todolistsApi.ts"
import { fetchTodolistsThunk, getTodolistsAC } from "./features/todolists/model/reducer/todolists/todolists-reducer.ts"
import { useAppDispatch } from "./common/hooks/useAppDispatch.ts"
import { ErrorSnackbar } from "./common/components/ErrorSnackbar/ErrorSnackbar.tsx"
import { Routing } from "./common/routing"


function App() {
  // const test = useTodolistsStore()
  const dispatch = useAppDispatch()

  const themeMode = useAppSelector(selectThemeMode)

  useEffect(() => {
    dispatch(fetchTodolistsThunk)
  }, [])

  return (
    <ThemeProvider theme={getTheme(themeMode)}>
      <CssBaseline />
      <Header />
      <Routing />
      <ErrorSnackbar />
    </ThemeProvider>
  )
}

export default App
