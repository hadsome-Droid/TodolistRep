import { tasksReducer, tasksSlice } from "../features/todolists/model/reducer/tasks/tasksSlice.ts"
import { todolistsReducer, todolistsSlice } from "../features/todolists/model/reducer/todolists/todolistsSlice.ts"
import { appReducer, appSlice } from "./appSlice.ts"
// import { authReducer, authSlice } from "../features/auth/model/authSlice.ts"
import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { baseApi } from "./baseApi.ts"


export const store = configureStore({
  reducer: {
    [tasksSlice.name]: tasksReducer,
    [todolistsSlice.name]: todolistsReducer,
    [appSlice.name]: appReducer,
    // [authSlice.name]: authReducer,
    [baseApi.reducerPath]: baseApi.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(baseApi.middleware)
})

setupListeners(store.dispatch)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// @ts-ignore
window.store = store