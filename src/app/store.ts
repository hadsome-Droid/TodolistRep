import { appReducer, appSlice } from "./appSlice.ts"
import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { baseApi } from "./baseApi.ts"


export const store = configureStore({
  reducer: {
    [appSlice.name]: appReducer,
    [baseApi.reducerPath]: baseApi.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(baseApi.middleware)
})

setupListeners(store.dispatch)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// @ts-ignore
window.store = store