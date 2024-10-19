import {combineReducers, legacy_createStore} from 'redux'
import {tasksReducer} from '../features/todolists/model/reducer/tasks/tasksReducer'
import {todolistsReducer} from '../features/todolists/model/reducer/todolists/todolists-reducer'
import {appReducer} from "./app-reducer.ts";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
})

export const store = legacy_createStore(rootReducer)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// @ts-ignore
window.store = store