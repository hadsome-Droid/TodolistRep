import { Dispatch } from "redux"
import { tasksApi } from "../../../api/tasks/tasks.Api.ts"
import { DomainTask, UpdateTaskDomainModel, UpdateTaskModel } from "../../../api/tasks/tasksApi.types.ts"
import { ResultCode } from "../../../../../common/enums/enums.ts"
import { AppDispatch, RootState } from "../../../../../app/store.ts"
import { setAppError, setAppStatus } from "../../../../../app/appSlice.ts"
import { handleServerAppError } from "../../../../../common/utils/handleServerAppError.ts"
import { handleServerNetworkError } from "../../../../../common/utils/handleServerNetworkError.ts"
import { addTodolist, removeTodolist } from "../todolists/todolistsSlice.ts"
import { asyncThunkCreator, buildCreateSlice, createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export type TaskProps = {
  id: string,
  title: string,
  isDone: boolean,
}

export type TasksStateType = {
  [key: string]: Array<DomainTask>
}

const initialState: TasksStateType = {}

const createSliceWithThunks = buildCreateSlice({ creators: { asyncThunk: asyncThunkCreator } })

export const tasksSlice = createSliceWithThunks({
  name: "tasks",
  initialState,
  selectors: {
    selectTasks: state => state
  },
  reducers: create => {
    const createAThunk = create.asyncThunk.withTypes<{ rejectValue: null }>()
    return {
      getTasks: create.asyncThunk(
        async (todolistId: string, { dispatch, rejectWithValue }) => {
          try {
            dispatch(setAppStatus({ status: "loading" }))
            const res = await tasksApi.getTasks(todolistId)
            dispatch(setAppStatus({ status: "success" }))
            return { todolistId, tasks: res.data.items }
          } catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks
          }
        }
      ),
      addTask: create.asyncThunk(
        async (args: { todolistId: string, title: string }, { dispatch, rejectWithValue }) => {
          try {
            dispatch(setAppStatus({ status: "loading" }))
            const res = await tasksApi.createTask(args)
            if (res.data.resultCode === ResultCode.Success) {
              dispatch(setAppStatus({ status: "success" }))
              return { task: res.data.data.item }
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
            const tasks = state[action.payload.task.todoListId]
            tasks.unshift(action.payload.task)
          }
        }
      ),
      removeTask: create.asyncThunk(
        async (args: { todolistId: string, taskId: string }, { dispatch, rejectWithValue }) => {
          try {
            dispatch(setAppStatus({ status: "loading" }))
            const res = await tasksApi.deleteTask(args)
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
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(task => task.id === action.payload.taskId)
            if (index !== -1) {
              tasks.splice(index, 1)
            }
          }
        }
      ),
      updateTask: createAThunk(
        async (
          args: { todolistId: string, taskId: string, domainModel: UpdateTaskDomainModel },
          { dispatch, rejectWithValue, getState }
        ) => {
          try {
            const { todolistId, taskId, domainModel } = args

            const allTasksFromState = (getState() as RootState).tasks
            const tasksFromCurrentTodolist = allTasksFromState[todolistId]
            const task = tasksFromCurrentTodolist.find(task => task.id === taskId)

            if (!task) {
              dispatch(setAppError({ error: "Task not found" }))
              return rejectWithValue(null)
            }

            const model: UpdateTaskModel = {
              status: task.status,
              title: task.title,
              deadline: task.deadline,
              description: task.description,
              priority: task.priority,
              startDate: task.startDate,
              ...domainModel
            }
            dispatch(setAppStatus({ status: "loading" }))
            const res = await tasksApi.updateTask({ todolistId, taskId, model })
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
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex((t) => t.id === action.payload.taskId)
            if (index !== -1) {
              tasks[index] = { ...tasks[index], ...action.payload.domainModel }
            }
          }
        }
      ),
      // getTasks: create.reducer<{ todolistId: string, tasks: DomainTask[] }>((state, action) => {
      //   state[action.payload.todolistId] = action.payload.tasks
      // }),
      // addTask: create.reducer<{ task: DomainTask }>((state, action) => {
      //   const tasks = state[action.payload.task.todoListId]
      //   tasks.unshift(action.payload.task)
      // }),
      // removeTask: create.reducer<{ todolistId: string, taskId: string }>((state, action) => {
      //   const tasks = state[action.payload.todolistId]
      //   const index = tasks.findIndex(task => task.id === action.payload.taskId)
      //   if (index !== -1) {
      //     tasks.splice(index, 1)
      //   }
      // }),
      // updateTask: create.reducer<{
      //   todolistId: string,
      //   taskId: string,
      //   domainModel: UpdateTaskDomainModel
      // }>((state, action) => {
      //   const tasks = state[action.payload.todolistId]
      //   const index = tasks.findIndex(task => task.id === action.payload.taskId)
      //   if (index !== -1) {
      //     tasks[index] = { ...tasks[index], ...action.payload.domainModel }
      //   }
      // }),
      clearTasks: create.reducer(() => {
        return {}
      })
    }
  },
  extraReducers: builder => {
    builder
      .addCase(addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.todolistId]
      })
    // .addCase(fetchTasks.fulfilled, (state, action) => {
    //   state[action.payload.todolistId] = action.payload.tasks
    // })
    // .addCase(fetchTasks.rejected, (state, action) => {
    //
    // })
  }
})

export const tasksReducer = tasksSlice.reducer
export const {selectTasks} = tasksSlice.selectors
export const {
  updateTask,
  removeTask,
  clearTasks,
  addTask,
  getTasks
} = tasksSlice.actions


// export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
//   dispatch(setAppStatus({ status: "loading" }))
//   tasksApi.getTasks(todolistId).then(res => {
//     const tasks = res.data.items
//     dispatch(setAppStatus({ status: "success" }))
//     dispatch(getTasks({ todolistId, tasks }))
//   })
//     .catch(error => {
//       handleServerNetworkError(error, dispatch)
//     })
// }

// export const createAppAsyncThunk = createAsyncThunk.withTypes<{
//   state: RootState
//   dispatch: AppDispatch
//   rejectValue: null
// }>()

// export const fetchTasks = createAppAsyncThunk<
//   { todolistId: string; tasks: DomainTask[] },
//   string>(
//   `${tasksSlice.name}/fetchTasks`,
//   async (todolistId, thunkAPI) => {
//     const dispatch = thunkAPI.dispatch
//     try {
//       dispatch(setAppStatus({ status: "loading" }))
//       const res = await tasksApi.getTasks(todolistId)
//       dispatch(setAppStatus({ status: "success" }))
//       return { todolistId: todolistId, tasks: res.data.items }
//     } catch (error) {
//       handleServerNetworkError(error, dispatch)
//       return thunkAPI.rejectWithValue(null)
//     }
//   }
// )

// export const removeTaskTC = (args: { todolistId: string, taskId: string }) => (dispatch: Dispatch) => {
//   dispatch(setAppStatus({ status: "loading" }))
//   tasksApi.deleteTask(args).then(res => {
//     if (res.data.resultCode === ResultCode.Success) {
//       dispatch(setAppStatus({ status: "success" }))
//       dispatch(removeTask(args))
//     } else {
//       handleServerAppError(res.data, dispatch)
//     }
//   })
//     .catch(error => {
//       handleServerNetworkError(error, dispatch)
//     })
// }

// export const createTaskTC = (args: { todolistId: string, title: string }) => (dispatch: Dispatch) => {
//   dispatch(setAppStatus({ status: "loading" }))
//   tasksApi
//     .createTask(args)
//     .then(res => {
//       if (res.data.resultCode === ResultCode.Success) {
//         dispatch(setAppStatus({ status: "success" }))
//         dispatch(addTask({ task: res.data.data.item }))
//       } else {
//         handleServerAppError(res.data, dispatch)
//       }
//
//     })
//     .catch(error => {
//       handleServerNetworkError(error, dispatch)
//     })
// }

// export const updateTaskTC = (args: { todolistId: string, taskId: string, domainModel: UpdateTaskDomainModel }) =>
//   (dispatch: Dispatch, getState: () => RootState) => {
//     dispatch(setAppStatus({ status: "loading" }))
//     const { todolistId, domainModel, taskId } = args
//
//     const allTasksFromState = getState().tasks
//     const tasksForCurrentTodolist = allTasksFromState[todolistId]
//     const task = tasksForCurrentTodolist.find(todo => todo.id === taskId)
//
//     if (task) {
//       const model: UpdateTaskModel = {
//         status: task.status,
//         title: task.title,
//         deadline: task.deadline,
//         description: task.description,
//         priority: task.priority,
//         startDate: task.startDate,
//         ...domainModel
//       }
//       tasksApi.updateTask({ taskId, todolistId, model }).then((res) => {
//         if (res.data.resultCode === ResultCode.Success) {
//           dispatch(setAppStatus({ status: "success" }))
//           dispatch(updateTask(args))
//         } else {
//           handleServerAppError(res.data, dispatch)
//         }
//       })
//         .catch(error => {
//           handleServerNetworkError(error, dispatch)
//         })
//     }
//   }
