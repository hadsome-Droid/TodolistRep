import { DomainTodolist, Todolist } from "../../../api/todolistsApi.types.ts"
import { Dispatch } from "redux"
import { todolistsApi } from "../../../api/todolistsApi.ts"
import { RequestStatus, setAppStatus } from "../../../../../app/appSlice.ts"
import { ResultCode } from "../../../../../common/enums/enums.ts"
import { handleServerAppError } from "../../../../../common/utils/handleServerAppError.ts"
import { handleServerNetworkError } from "../../../../../common/utils/handleServerNetworkError.ts"
import { asyncThunkCreator, buildCreateSlice, createSlice } from "@reduxjs/toolkit"

export type FilterValuesType = "all" | "active" | "completed"

const initialState: DomainTodolist[] = []

const createSliceWithThunks = buildCreateSlice({ creators: { asyncThunk: asyncThunkCreator } })

export const todolistsSlice = createSliceWithThunks({
  name: "todolists",
  initialState,
  selectors: {
    selectTodolists: state => state
  },
  reducers: create => {
    const createAThunk = create.asyncThunk.withTypes<{ rejectValue: null }>()
    return {
      getTodolists: create.asyncThunk(
        async (_, { dispatch, rejectWithValue }) => {
          try {
            dispatch(setAppStatus({ status: "loading" }))
            const res = await todolistsApi.getTodolists()
            dispatch(setAppStatus({ status: "success" }))
            return { todolists: res.data }
          } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (_, action) => {
            return action.payload.todolists.map(todo => ({ ...todo, filter: "all", entityStatus: "idle" }))
          }
        }
      ),
      removeTodolist: create.asyncThunk(
        async (todolistId: string, { dispatch, rejectWithValue }) => {
          try {
            dispatch(setAppStatus({ status: "loading" }))
            dispatch(changeTodolistEntityStatus({ id: todolistId, entityStatus: "loading" }))
            const res = await todolistsApi.deleteTodolist(todolistId)
            if (res.data.resultCode === ResultCode.Success) {
              dispatch(setAppStatus({ status: "success" }))
              return { todolistId }
            } else {
              handleServerAppError(res.data, dispatch)
              return rejectWithValue(null)
            }
          } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            const index = state.findIndex((todo) => todo.id === action.payload.todolistId)
            if (index !== -1) {
              state.splice(index, 1)
            }
          }
        }
      ),
      addTodolist: create.asyncThunk(
        async (title: string, { dispatch, rejectWithValue }) => {
          try {
            dispatch(setAppStatus({ status: "loading" }))
            const res = await todolistsApi.createTodolist(title)
            if (res.data.resultCode === ResultCode.Success) {
              dispatch(setAppStatus({ status: "success" }))
              return { todolist: res.data.data.item }
            } else {
              handleServerAppError(res.data, dispatch)
              return rejectWithValue(null)
            }
          } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
          }
        }
      ),
      updateTodolist: create.asyncThunk(
        async (args: { id: string, title: string }, { dispatch, rejectWithValue }) => {
          try {
            dispatch(setAppStatus({ status: "loading" }))
            const res = await todolistsApi.updateTodolist(args)
            if (res.data.resultCode === ResultCode.Success) {
              dispatch(setAppStatus({ status: "success" }))
              return args
            } else {
              handleServerAppError(res.data, dispatch)
              return rejectWithValue(null)
            }
          } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            const index = state.findIndex((todo) => todo.id === action.payload.id)
            if (index !== -1) {
              state[index].title = action.payload.title
            }
          }
        }
      ),
      // getTodolists: create.reducer<{ todolists: Todolist[] }>((state, action) => {
      //   // action.payload.todolists.forEach((todo) => {
      //   //   state.push({ ...todo, filter: "all", entityStatus: "idle" }) дублирует state! хз почему =)
      //   // })
      //   return action.payload.todolists.map(tl => ({ ...tl, filter: "all", entityStatus: "idle" }))
      // }),
      // removeTodolist: create.reducer<{ todolistId: string }>((state, action) => {
      //   const index = state.findIndex(tl => tl.id === action.payload.todolistId)
      //   if (index !== -1) {
      //     state.splice(index, 1)
      //   }
      // }),
      // addTodolist: create.reducer<{ todolist: Todolist }>((state, action) => {
      //   state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
      // }),
      // updateTodolist: create.reducer<{ id: string, title: string }>((state, action) => {
      //   const index = state.findIndex(tl => tl.id === action.payload.id)
      //   if (index !== -1) {
      //     state[index].title = action.payload.title
      //   }
      // }),
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
    }
  }
})

export const todolistsReducer = todolistsSlice.reducer
export const {selectTodolists} = todolistsSlice.selectors
export const {
  removeTodolist,
  changeTodolistFilter,
  clearTodolists,
  addTodolist,
  changeTodolistEntityStatus,
  getTodolists,
  updateTodolist
} = todolistsSlice.actions


// export const fetchTodolistsThunk = (dispatch: Dispatch) => {
//   dispatch(setAppStatus({ status: "loading" }))
//   todolistsApi.getTodolists().then(res => {
//     dispatch(setAppStatus({ status: "success" }))
//     dispatch(getTodolists({ todolists: res.data }))
//   }).catch(error => {
//     handleServerNetworkError(error, dispatch)
//   })
// }

// export const createTodolistThunk = (title: string) => (dispatch: Dispatch) => {
//   dispatch(setAppStatus({ status: "loading" }))
//   todolistsApi.createTodolist(title).then(res => {
//     if (res.data.resultCode === ResultCode.Success) {
//       dispatch(setAppStatus({ status: "success" }))
//       dispatch(addTodolist({ todolist: res.data.data.item }))
//     } else {
//       handleServerAppError(res.data, dispatch)
//     }
//
//   })
//     .catch(error => {
//       handleServerNetworkError(error, dispatch)
//     })
// }

// export const deleteTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
//   dispatch(setAppStatus({ status: "loading" }))
//   dispatch(changeTodolistEntityStatus({ id: todolistId, entityStatus: "loading" }))
//   todolistsApi.deleteTodolist(todolistId).then(res => {
//     if (res.data.resultCode === ResultCode.Success) {
//       dispatch(setAppStatus({ status: "success" }))
//       dispatch(removeTodolist({ todolistId }))
//     } else {
//       handleServerAppError(res.data, dispatch)
//     }
//   })
//     .catch(error => {
//       handleServerNetworkError(error, dispatch)
//     })
// }

// export const updateTodolistTC = (args: { todolistId: string, title: string }) => (dispatch: Dispatch) => {
//   dispatch(setAppStatus({ status: "loading" }))
//   todolistsApi.updateTodolist({ id: args.todolistId, title: args.title }).then(res => {
//     if (res.data.resultCode === ResultCode.Success) {
//       dispatch(setAppStatus({ status: "success" }))
//       dispatch(updateTodolist({ id: args.todolistId, title: args.title }))
//     } else {
//       handleServerAppError(res.data, dispatch)
//     }
//   })
//     .catch(error => {
//       handleServerNetworkError(error, dispatch)
//     })
// }  // 126 strok