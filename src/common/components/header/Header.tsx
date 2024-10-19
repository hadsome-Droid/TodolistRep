import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import {MenuButton} from "../MenuButton.tsx";
import Switch from "@mui/material/Switch";
import Grid2 from "@mui/material/Grid2";
import {RootState} from "../../../app/store.ts";
import {changeThemeAC, ThemeMode} from "../../../app/app-reducer.ts";
import {useAppDispatch} from "../../hooks/useAppDispatch.ts";
import {useAppSelector} from "../../hooks/useAppSelector.ts";

export const Header = () => {
    const themeMode = useAppSelector<RootState, ThemeMode>(state => state.app?.themeMode)
    const dispatch = useAppDispatch()


    const changeModeHandler = () => {
        dispatch(changeThemeAC(themeMode == 'dark' ? 'light' : 'dark'))
    }
    return (
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
    );
};