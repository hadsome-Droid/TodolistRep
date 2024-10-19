import './App.css'
import CssBaseline from '@mui/material/CssBaseline'
import {ThemeProvider} from '@mui/material/styles'
// import {useTodolistsStore} from "./model/zust/todolists-zustan.ts";
import {getTheme} from "./common/theme/theme.ts";
import {Header} from "./common/components/header/Header.tsx";
import {Main} from "./app/main/Main.tsx";
import {useAppSelector} from "./common/hooks/useAppSelector.ts";
import {selectThemeMode} from "./app/appSelectors.ts";


function App() {
    // const test = useTodolistsStore()

    const themeMode = useAppSelector(selectThemeMode)



    return (
        <ThemeProvider theme={getTheme(themeMode)}>
            <CssBaseline/>
            <Header/>
            <Main/>
        </ThemeProvider>
    )
}

export default App
