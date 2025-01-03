import { createSlice } from "@reduxjs/toolkit"

export type ThemeMode = "dark" | "light"
export type RequestStatus = "idle" | "loading" | "success" | "failed"

type InitialState = typeof initialState

const initialState = {
  themeMode: "dark" as ThemeMode,
  status: "idle" as RequestStatus,
  error: null as string | null
}

type ActionType =
  ReturnType<typeof changeThemeAC>
  | ReturnType<typeof setAppStatusAC>
  | ReturnType<typeof setAppErrorAC>

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
// export const appSlice = (state: InitialState = initialState, action: ActionType) => {
//     switch (action.type) {
//         case 'CHANGE_THEME': {
//             return {
//                 ...state,
//                 themeMode: action.payload.themeMode,
//             }
//         }
//         case "SET_APP_STATUS": {
//             return {
//                 ...state,
//                 status: action.payload.status,
//             }
//         }
//         case "SET_APP_ERROR": {
//             return {
//                 ...state,
//                 error: action.payload.error,
//             }
//         }
//         default:
//             return state
//     }
// }

export const changeThemeAC = (themeMode: ThemeMode) => {
  return { type: "CHANGE_THEME", payload: { themeMode } } as const
}

export const setAppStatusAC = (status: RequestStatus) => {
  return { type: "SET_APP_STATUS", payload: { status } } as const
}

export const setAppErrorAC = (error: string | null) => {
  return { type: "SET_APP_ERROR", payload: { error } } as const
}