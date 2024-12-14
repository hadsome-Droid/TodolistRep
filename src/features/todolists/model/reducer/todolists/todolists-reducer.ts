import { v4 as uuidv4 } from "uuid"
import { DomainTodolist, Todolist } from "../../../api/todolistsApi.types.ts"
import { Dispatch } from "redux"
import { RootState } from "../../../../../app/store.ts"
import { todolistsApi } from "../../../api/todolistsApi.ts"
import { RequestStatus, setAppStatusAC } from "../../../../../app/app-reducer.ts"
import { ResultCode } from "../../../../../common/enums/enums.ts"
import { handleServerAppError } from "../../../../../common/utils/handleServerAppError.ts"
import { handleServerNetworkError } from "../../../../../common/utils/handleServerNetworkError.ts"
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

// const todolistId1 = uuidv4()
// const todolistId2 = uuidv4()

// const initialState: TodolistType[] = [
//     {id: todolistId1, title: 'What to learn', filter: 'all'},
//     {id: todolistId2, title: 'Song of live', filter: 'all'},
// ]


const initialState: DomainTodolist[] = []

export const todolistsReducer = (state: DomainTodolist[] = initialState, action: ActionsType): DomainTodolist[] => {
  switch (action.type) {
    case "GET-TODOLISTS": {
      return action.payload.todolists.map(todo => ({ ...todo, filter: "all", entityStatus: "idle" }))
    }
    case "REMOVE-TODOLIST": {
      return state.filter((todo) => todo.id !== action.payload.id)
    }
    case "ADD-TODOLIST": {
      const newTodolist: DomainTodolist = {
        id: action.payload.todolist.id,
        title: action.payload.todolist.title,
        filter: "all",
        entityStatus: "idle",
        addedDate: "",
        order: 0
      }
      return [
        newTodolist,
        ...state
      ]
    }
    case "UPDATE-TODOLIST-TITLE": {
      return state.map((todo) => todo.id === action.payload.id ? { ...todo, title: action.payload.title } : todo)
    }
    case "CHANGE-TODOLIST-FILTER": {
      return state.map((todo) => todo.id === action.payload.id ? { ...todo, filter: action.payload.filter } : todo)
    }
    case "CHANGE-TODOLIST-ENTITY-STATUS": {
      return state.map(todo => todo.id === action.payload.id ? {
        ...todo,
        entityStatus: action.payload.entityStatus
      } : todo)
    }
    default:
      return state
    // throw new Error("I don't understand this type")
  }
}

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

export const fetchTodolistsThunk = (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"))
  todolistsApi.getTodolists().then(res => {
    dispatch(setAppStatusAC("success"))
    dispatch(getTodolistsAC(res.data))
  })
}

export const createTodolistThunk = (title: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"))
  todolistsApi.createTodolist(title).then(res => {
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(setAppStatusAC("success"))
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
  dispatch(setAppStatusAC("loading"))
  dispatch(changeTodolistEntityStatusAC({ id: todolistId, entityStatus: "loading" }))
  todolistsApi.deleteTodolist(todolistId).then(res => {
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(setAppStatusAC("success"))
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
  dispatch(setAppStatusAC("loading"))
  todolistsApi.updateTodolist({ id: args.todolistId, title: args.title }).then(res => {
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(setAppStatusAC("success"))
      dispatch(updateTodolistTitleAC({ id: args.todolistId, title: args.title }))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  })
    .catch(error => {
      handleServerNetworkError(error, dispatch)
    })
}