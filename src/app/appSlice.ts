import { createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit"
import { todolistsApi } from "../features/todolists/api/todolistsApi.ts"
import { tasksApi } from "../features/todolists/api/tasks/tasks.Api.ts"

export type ThemeMode = "dark" | "light"
export type RequestStatus = "idle" | "loading" | "success" | "failed"

const initialState = {
  themeMode: "dark" as ThemeMode,
  status: "idle" as RequestStatus,
  error: null as string | null,
  isLoggedIn: false
}

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: create => ({
    changeTheme: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      state.themeMode = action.payload.themeMode
    }),
    setAppStatus: create.reducer<{ status: RequestStatus }>((state, action) => {
      state.status = action.payload.status
    }),
    setAppError: create.reducer<{ error: string | null }>((state, action) => {
      state.error = action.payload.error
    }),
    setIsLoggedIn: create.reducer<{ isLoggedIn: boolean }>((state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    })
  }),
  selectors: {
    selectIsLoggedIn: state => state.isLoggedIn
  },
  extraReducers: builder => {
    builder.addMatcher(
      isPending,
      (state, action) => {
        if (
          todolistsApi.endpoints.getTodolists.matchPending(action) ||
          tasksApi.endpoints.getTasks.matchPending(action)
        ) {
          return
        }
        state.status = "loading"
      }
    )
      .addMatcher(isFulfilled, state => {
        state.status = "success"
      })
      .addMatcher(isRejected, state => {
        state.status = "failed"
      })
  }
})

export const appReducer = appSlice.reducer
export const { changeTheme, setAppStatus, setAppError, setIsLoggedIn } = appSlice.actions
export const { selectIsLoggedIn } = appSlice.selectors