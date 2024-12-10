import { applyMiddleware, combineReducers, legacy_createStore, UnknownAction } from "redux"
import {tasksReducer} from '../features/todolists/model/reducer/tasks/tasksReducer'
import {todolistsReducer} from '../features/todolists/model/reducer/todolists/todolists-reducer'
import {appReducer} from "./app-reducer.ts";
import { thunk, ThunkDispatch } from "redux-thunk"


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
})

export const store = legacy_createStore(rootReducer, {}, applyMiddleware(thunk));

export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch

export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>
// @ts-ignore
window.store = store