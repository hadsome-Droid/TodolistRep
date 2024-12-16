import s from "./App.module.css"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
// import {useTodolistsStore} from "./model/zust/todolists-zustan.ts";
import { getTheme } from "./common/theme/theme.ts"
import { Header } from "./common/components/header/Header.tsx"
import { useAppSelector } from "./common/hooks/useAppSelector.ts"
import { selectThemeMode } from "./app/appSelectors.ts"
import { ErrorSnackbar } from "./common/components/ErrorSnackbar/ErrorSnackbar.tsx"
import { Routing } from "./common/routing"
import { useAppDispatch } from "./common/hooks/useAppDispatch.ts"
import { useEffect } from "react"
import { initializeAppTC } from "./features/auth/model/authReducer.ts"
import { selectIsInitialized } from "./features/auth/model/authSelectors.ts"
import CircularProgress from "@mui/material/CircularProgress"


function App() {
  // const test = useTodolistsStore()
  const themeMode = useAppSelector(selectThemeMode)
  const isInitialized = useAppSelector(selectIsInitialized)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(initializeAppTC())
  }, [])

  if (!isInitialized) {
    return (
      <div className={s.circularProgressContainer}>
        <CircularProgress size={150} thickness={3} />
      </div>
    )
  }

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
