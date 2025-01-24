import Grid2 from "@mui/material/Grid2"
import { AddItemForm } from "../../common/components/addItemForm/AdditemForm.tsx"
import Container from "@mui/material/Container"
import { Todolists } from "../../features/todolists/ui/Todolists/Todolists.tsx"
import { useAppSelector } from "./../../common/hooks/useAppSelector.ts"
import { useNavigate } from "react-router"
import { useEffect } from "react"
import { Path } from "./../../common/routing/routing.tsx"
// import { selectIsLoggedIn } from "../../features/auth/model/authSlice.ts"
import { useCreateTodolistMutation } from "../../features/todolists/api/todolistsApi.ts"
import { selectIsLoggedIn } from "../appSlice.ts"

export const Main = () => {
  const [createTodolist] = useCreateTodolistMutation()
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const navigate = useNavigate()

  const handleAddTodolist = (title: string) => {
    createTodolist(title)
  }

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(Path.Login)
    }
  }, [isLoggedIn])

  return (
    <Container fixed>
      <Grid2 container sx={{ mb: "30px" }}>
        <AddItemForm addItem={handleAddTodolist} />
      </Grid2>
      <Grid2 container spacing={4}>
        <Todolists />
      </Grid2>
    </Container>
  )
}
