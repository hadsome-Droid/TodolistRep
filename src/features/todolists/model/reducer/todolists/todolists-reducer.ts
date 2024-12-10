import { v4 as uuidv4 } from "uuid"
import { DomainTodolist, Todolist } from "../../../api/todolistsApi.types.ts"
import { Dispatch } from "redux"
import { RootState } from "../../../../../app/store.ts"
import { todolistsApi } from "../../../api/todolistsApi.ts"
// import {TodolistType} from "../../../App.tsx";
// import {FilterValuesType} from "../../../components/todolist/Todolist.tsx";

export type FilterValuesType = "all" | "active" | "completed"

// export type TodolistType = {
//     id: string,
//     title: string,
//     filter: FilterValuesType,
// }

export type RemoveTodolistActionType = {
  type: "REMOVE-TODOLIST"
  payload: {
    id: string
  }
}

export type AddTodolistActionType = {
  type: "ADD-TODOLIST"
  payload: {
    todolistId: string
    title: string
  }
}

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
      return action.payload.todolists.map(todo => ({ ...todo, filter: "all" }))
    }
    case "REMOVE-TODOLIST": {
      return state.filter((todo) => todo.id !== action.payload.id)
    }
    case "ADD-TODOLIST": {
      const newTodolist: DomainTodolist = {
        id: action.payload.todolistId,
        title: action.payload.title,
        filter: "all",
        addedDate: "",
        order: 0
      }
      return [
        ...state,
        newTodolist
      ]
    }
    case "UPDATE-TODOLIST-TITLE": {
      return state.map((todo) => todo.id === action.payload.id ? { ...todo, title: action.payload.title } : todo)
    }
    case "CHANGE-TODOLIST-FILTER": {
      return state.map((todo) => todo.id === action.payload.id ? { ...todo, filter: action.payload.filter } : todo)
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

export const fetchTodolistsThunk = (dispatch: Dispatch, getState: () => RootState) => {
  todolistsApi.getTodolists().then(res => {
    dispatch(getTodolistsAC(res.data))
  })
}

export const createTodolistThunk = (title: string) => (dispatch: Dispatch) => {
  todolistsApi.createTodolist(title).then(res => {
    dispatch(addTodolistAC(res.data.data.item))
  })
}

export const deleteTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
  todolistsApi.deleteTodolist(todolistId).then(res => {
    dispatch(removeTodolistAC(todolistId))
  })
}

export const updateTodolistTC = (args:{todolistId: string, title: string}) => (dispatch: Dispatch) => {
    todolistsApi.updateTodolist({id: args.todolistId, title: args.title}).then(res => {
      dispatch(updateTodolistTitleAC({id: args.todolistId, title: args.title}))
    })
}