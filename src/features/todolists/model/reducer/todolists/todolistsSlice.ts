
import { DomainTodolist, Todolist } from "../../../api/todolistsApi.types.ts"
import { Dispatch } from "redux"
import { todolistsApi } from "../../../api/todolistsApi.ts"
import { RequestStatus, setAppStatus } from "../../../../../app/appSlice.ts"
import { ResultCode } from "../../../../../common/enums/enums.ts"
import { handleServerAppError } from "../../../../../common/utils/handleServerAppError.ts"
import { handleServerNetworkError } from "../../../../../common/utils/handleServerNetworkError.ts"
import { createSlice } from "@reduxjs/toolkit"

export type FilterValuesType = "all" | "active" | "completed"

const initialState: DomainTodolist[] = []

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState,
  reducers: create => ({
    getTodolists: create.reducer<{ todolists: Todolist[] }>((state, action) => {
      // action.payload.todolists.forEach((todo) => {
      //   state.push({ ...todo, filter: "all", entityStatus: "idle" }) дублирует state! хз почему =)
      // })
      return action.payload.todolists.map(tl => ({ ...tl, filter: 'all', entityStatus: 'idle' }))
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


export const fetchTodolistsThunk = (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: "loading" }))
  todolistsApi.getTodolists().then(res => {
    dispatch(setAppStatus({ status: "success" }))
    dispatch(getTodolists({ todolists: res.data }))
  }).catch(error => {
    handleServerNetworkError(error, dispatch)
  })
}

export const createTodolistThunk = (title: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: "loading" }))
  todolistsApi.createTodolist(title).then(res => {
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(setAppStatus({ status: "success" }))
      dispatch(addTodolist({todolist: res.data.data.item }))
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
  dispatch(changeTodolistEntityStatus({ id: todolistId, entityStatus: "loading" }))
  todolistsApi.deleteTodolist(todolistId).then(res => {
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(setAppStatus({ status: "success" }))
      dispatch(removeTodolist({ todolistId }))
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
      dispatch(updateTodolist({ id: args.todolistId, title: args.title }))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  })
    .catch(error => {
      handleServerNetworkError(error, dispatch)
    })
}