import s from "./App.module.css"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { getTheme } from "./common/theme/theme.ts"
import { Header } from "./common/components/header/Header.tsx"
import { useAppSelector } from "./common/hooks/useAppSelector.ts"
import { selectThemeMode } from "./app/appSelectors.ts"
import { ErrorSnackbar } from "./common/components/ErrorSnackbar/ErrorSnackbar.tsx"
import { Routing } from "./common/routing"
import { useAppDispatch } from "./common/hooks/useAppDispatch.ts"
import { useEffect, useState } from "react"
import CircularProgress from "@mui/material/CircularProgress"
import { useMeQuery } from "./features/auth/api/authApi.ts"
import { ResultCode } from "./common/enums/enums.ts"
import { setIsLoggedIn } from "./app/appSlice.ts"


function App() {
  const { data, isLoading } = useMeQuery()
  const themeMode = useAppSelector(selectThemeMode)
  const dispatch = useAppDispatch()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      setIsInitialized(true)
      if (data?.resultCode === ResultCode.Success) {
        dispatch(setIsLoggedIn({ isLoggedIn: true }))
      }
    }
  }, [isLoading, data])

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
