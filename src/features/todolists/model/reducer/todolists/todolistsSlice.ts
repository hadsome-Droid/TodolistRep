import { v4 as uuidv4 } from "uuid"
import { DomainTodolist, Todolist } from "../../../api/todolistsApi.types.ts"
import { Dispatch } from "redux"
import { RootState } from "../../../../../app/store.ts"
import { todolistsApi } from "../../../api/todolistsApi.ts"
import { RequestStatus, setAppStatus, setAppStatusAC } from "../../../../../app/appSlice.ts"
import { ResultCode } from "../../../../../common/enums/enums.ts"
import { handleServerAppError } from "../../../../../common/utils/handleServerAppError.ts"
import { handleServerNetworkError } from "../../../../../common/utils/handleServerNetworkError.ts"
import { createSlice } from "@reduxjs/toolkit"
// import {TodolistType} from "../../../App.tsx";
// import {FilterValuesType} from "../../../components/todolist/Todolist.tsx";

export type FilterValuesType = "all" | "active" | "completed"

// export type TodolistType = {
//     id: string,
//     title: string,
//     filter: FilterValuesType,
// }

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>

export type AddTodolistActionType = ReturnType<typeof addTodolistAC>

export type ChangeTodolistTitleActionType = {
  type: "UPDATE-TODOLIST-TITLE"
  payload: {
    id: string
    title: string
  }
}

export type ChangeTodolistFilterActionType = {
  type: "CHANGE-TODOLIST-FILTER"
  payload: {
    id: string
    filter: FilterValuesType
  }
}

type ActionsType =
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ChangeTodolistTitleActionType
  | ChangeTodolistFilterActionType
  | ReturnType<typeof getTodolistsAC>
  | ReturnType<typeof changeTodolistEntityStatusAC>
  | ReturnType<typeof clearTodolistsAC>

// const todolistId1 = uuidv4()
// const todolistId2 = uuidv4()

// const initialState: TodolistType[] = [
//     {id: todolistId1, title: 'What to learn', filter: 'all'},
//     {id: todolistId2, title: 'Song of live', filter: 'all'},
// ]


const initialState: DomainTodolist[] = []

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState,
  reducers: create => ({
    getTodolists: create.reducer<{ todolists: Todolist[] }>((state, action) => {
      action.payload.todolists.forEach((todo) => {
        state.push({ ...todo, filter: "all", entityStatus: "idle" })
      })
    }),
    removeTodolist: create.reducer<{ todolistId: string }>((state, action) => {
      const index = state.findIndex(tl => tl.id === action.payload.todolistId)
      if (index !== -1) {
        state.splice(index, 1)
      }
    }),
    addTodolist: create.reducer<{ todolist: Todolist }>((state, action) => {
      state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
    }),
    updateTodolist: create.reducer<{ id: string, title: string }>((state, action) => {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      if (index !== -1) {
        state[index].title = action.payload.title
      }
    }),
    changeTodolistFilter: create.reducer<{ id: string, filter: FilterValuesType }>((state, action) => {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      if (index !== -1) {
        state[index].filter = action.payload.filter
      }
    }),
    changeTodolistEntityStatus: create.reducer<{ id: string, entityStatus: RequestStatus }>((state, action) => {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      if (index !== -1) {
        state[index].entityStatus = action.payload.entityStatus
      }
    }),
    clearTodolists: create.reducer(() => {
      return []
    })
  })
})

export const todolistsReducer = todolistsSlice.reducer
export const {
  removeTodolist,
  changeTodolistFilter,
  clearTodolists,
  addTodolist,
  changeTodolistEntityStatus,
  getTodolists,
  updateTodolist
} = todolistsSlice.actions

// export const todolistsSlice = (state: DomainTodolist[] = initialState, action: ActionsType): DomainTodolist[] => {
//   switch (action.type) {
//     case "GET-TODOLISTS": {
//       return action.payload.todolists.map(todo => ({ ...todo, filter: "all", entityStatus: "idle" }))
//     }
//     case "REMOVE-TODOLIST": {
//       return state.filter((todo) => todo.id !== action.payload.id)
//     }
//     case "ADD-TODOLIST": {
//       const newTodolist: DomainTodolist = {
//         id: action.payload.todolist.id,
//         title: action.payload.todolist.title,
//         filter: "all",
//         entityStatus: "idle",
//         addedDate: "",
//         order: 0
//       }
//       return [
//         newTodolist,
//         ...state
//       ]
//     }
//     case "UPDATE-TODOLIST-TITLE": {
//       return state.map((todo) => todo.id === action.payload.id ? { ...todo, title: action.payload.title } : todo)
//     }
//     case "CHANGE-TODOLIST-FILTER": {
//       return state.map((todo) => todo.id === action.payload.id ? { ...todo, filter: action.payload.filter } : todo)
//     }
//     case "CHANGE-TODOLIST-ENTITY-STATUS": {
//       return state.map(todo => todo.id === action.payload.id ? {
//         ...todo,
//         entityStatus: action.payload.entityStatus
//       } : todo)
//     }
//     case "CLEAR-TODOLISTS":{
//       return []
//     }
//     default:
//       return state
//     // throw new Error("I don't understand this type")
//   }
// }

export const getTodolistsAC = (todolists: Todolist[]) => {
  return { type: "GET-TODOLISTS", payload: { todolists } } as const
}

export const removeTodolistAC = (todolistId: string) => {
  return { type: "REMOVE-TODOLIST", payload: { id: todolistId } } as const
}

export const addTodolistAC = (todolist: Todolist) => {
  return { type: "ADD-TODOLIST", payload: { todolist } } as const
}

export const updateTodolistTitleAC = (payload: { id: string, title: string }) => {
  return { type: "UPDATE-TODOLIST-TITLE", payload } as const
}

export const changeTodolistFilterAC = (payload: { id: string, filter: FilterValuesType }) => {
  return { type: "CHANGE-TODOLIST-FILTER", payload } as const
}

export const changeTodolistEntityStatusAC = (payload: { id: string, entityStatus: RequestStatus }) => {
  return { type: "CHANGE-TODOLIST-ENTITY-STATUS", payload } as const
}

export const clearTodolistsAC = () => {
  return { type: "CLEAR-TODOLISTS" } as const
}


export const fetchTodolistsThunk = (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: "loading" }))
  todolistsApi.getTodolists().then(res => {
    dispatch(setAppStatus({ status: "success" }))
    dispatch(getTodolistsAC(res.data))
  }).catch(error => {
    handleServerNetworkError(error, dispatch)
  })
}

export const createTodolistThunk = (title: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: "loading" }))
  todolistsApi.createTodolist(title).then(res => {
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(setAppStatus({ status: "success" }))
      dispatch(addTodolistAC(res.data.data.item))
    } else {
      handleServerAppError(res.data, dispatch)
    }

  })
    .catch(error => {
      handleServerNetworkError(error, dispatch)
    })
}

export const deleteTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: "loading" }))
  dispatch(changeTodolistEntityStatusAC({ id: todolistId, entityStatus: "loading" }))
  todolistsApi.deleteTodolist(todolistId).then(res => {
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(setAppStatus({ status: "success" }))
      dispatch(removeTodolistAC(todolistId))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  })
    .catch(error => {
      handleServerNetworkError(error, dispatch)
    })
}

export const updateTodolistTC = (args: { todolistId: string, title: string }) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: "loading" }))
  todolistsApi.updateTodolist({ id: args.todolistId, title: args.title }).then(res => {
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(setAppStatus({ status: "success" }))
      dispatch(updateTodolistTitleAC({ id: args.todolistId, title: args.title }))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  })
    .catch(error => {
      handleServerNetworkError(error, dispatch)
    })
}