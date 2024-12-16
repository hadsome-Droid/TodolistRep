import Grid2 from "@mui/material/Grid2"
import { AddItemForm } from "../../common/components/addItemForm/AdditemForm.tsx"
import {
  createTodolistThunk
} from "../../features/todolists/model/reducer/todolists/todolists-reducer.ts"
import Container from "@mui/material/Container"
import { Todolists } from "../../features/todolists/ui/Todolists/Todolists.tsx"
import { useAppDispatch } from "../../common/hooks/useAppDispatch.ts"
import { useAppSelector } from "./../../common/hooks/useAppSelector.ts"
import { selectLoggedIn } from "../../features/auth/model/authSelectors.ts"
import { useNavigate } from "react-router"
import { useEffect } from "react"
import { Path } from "./../../common/routing/routing.tsx"

export const Main = () => {
  const isLoggedIn = useAppSelector(selectLoggedIn)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const addTodolist = (title: string) => {

    dispatch(createTodolistThunk(title))
  }

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(Path.Login)
    }
  }, [isLoggedIn])

  return (
    <Container fixed>
      <Grid2 container sx={{ mb: "30px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid2>
      <Grid2 container spacing={4}>
        <Todolists />
      </Grid2>
    </Container>
  )
}
