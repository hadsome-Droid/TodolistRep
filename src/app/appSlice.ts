import { createSlice } from "@reduxjs/toolkit"

export type ThemeMode = "dark" | "light"
export type RequestStatus = "idle" | "loading" | "success" | "failed"

const initialState = {
  themeMode: "dark" as ThemeMode,
  status: "idle" as RequestStatus,
  error: null as string | null
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
    })
  })
})

export const appReducer = appSlice.reducer
export const {changeTheme, setAppStatus, setAppError} = appSlice.actions