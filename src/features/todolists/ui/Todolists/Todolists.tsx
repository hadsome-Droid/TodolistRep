import Grid2 from "@mui/material/Grid2"
import Paper from "@mui/material/Paper"
import { Todolist } from "./todolist/Todolist.tsx"
import { useGetTodolistsQuery } from "../../api/todolistsApi.ts"
import { TodolistSkeleton } from "./todolist/skeletons/TodolistSkeleton/TodolistSkeleton.tsx"

export const Todolists = () => {
  const {data: todolists, isLoading} = useGetTodolistsQuery()

  if(isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '32px' }}>
        {
          Array(3)
            .fill(null)
            .map((_, id) => (
              <TodolistSkeleton key={id} />
            ))
        }
      </div>
    )
  }

  return (
    <>
      {todolists?.map((todolist) => {
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
