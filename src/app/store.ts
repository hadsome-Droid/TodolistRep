import { applyMiddleware, combineReducers, legacy_createStore, UnknownAction } from "redux"
import {tasksReducer} from '../features/todolists/model/reducer/tasks/tasksReducer'
import {todolistsSlice} from '../features/todolists/model/reducer/todolists/todolistsSlice.ts'
import {appSlice} from "./appSlice.ts";
import { thunk, ThunkDispatch } from "redux-thunk"
import { authReducer, authSlice } from "../features/auth/model/authSlice.ts"
import { configureStore } from "@reduxjs/toolkit"




const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsSlice,
    app: appSlice,
    auth: authReducer,
})

export const store = configureStore({
    reducer: rootReducer,
})

// export const store = legacy_createStore(rootReducer, {}, applyMiddleware(thunk));

export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch

export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>
// @ts-ignore
window.store = store