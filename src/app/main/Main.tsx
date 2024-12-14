import Grid2 from "@mui/material/Grid2";
import {AddItemForm} from "../../common/components/addItemForm/AdditemForm.tsx";
import {
  addTodolistAC,
  createTodolistThunk
} from "../../features/todolists/model/reducer/todolists/todolists-reducer.ts"
import Container from "@mui/material/Container";
import {Todolists} from "../../features/todolists/ui/Todolists/Todolists.tsx";
import {useAppDispatch} from "../../common/hooks/useAppDispatch.ts";

export const Main = () => {

    const dispatch = useAppDispatch()

    const addTodolist = (title: string) => {

        dispatch(createTodolistThunk(title))
    }

    return (
        <Container fixed>
            <Grid2 container sx={{mb: '30px'}}>
                <AddItemForm addItem={addTodolist}/>
            </Grid2>
            <Grid2 container spacing={4}>
                <Todolists/>
            </Grid2>
        </Container>
    );
};
