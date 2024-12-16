import Grid2 from "@mui/material/Grid2"
import Paper from "@mui/material/Paper"
import { Todolist } from "./todolist/Todolist.tsx"
import { useAppSelector } from "../../../../common/hooks/useAppSelector.ts"
import { selectTodolists } from "../../model/reducer/todolistsSelectors.ts"
import { useEffect } from "react"
import { useAppDispatch } from "./../../../../common/hooks/useAppDispatch.ts"
import { fetchTodolistsThunk } from "../../model/reducer/todolists/todolists-reducer.ts"

export const Todolists = () => {
  const todolists = useAppSelector(selectTodolists)
  const dispatch = useAppDispatch()

  useEffect(() => {
        dispatch(fetchTodolistsThunk)
  }, [])

  return (
    <>
      {todolists.map((todolist) => {
        return (
          <Grid2 key={todolist.id}>
            <Paper sx={{ p: "0 20px 20px 20px" }}>
              <Todolist
                todolist={todolist}
              />
            </Paper>
          </Grid2>
        )
      })}
    </>
  )
}
