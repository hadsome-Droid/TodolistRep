import { v4 as uuidv4 } from "uuid"
import { Dispatch } from "redux"
import { tasksApi } from "../../../api/tasks/tasks.Api.ts"
import { DomainTask, UpdateTaskDomainModel, UpdateTaskModel } from "../../../api/tasks/tasksApi.types.ts"
import { ResultCode, TaskPriority, TaskStatus } from "../../../../../common/enums/enums.ts"
import { RootState } from "../../../../../app/store.ts"
import { setAppErrorAC, setAppStatus, setAppStatusAC } from "../../../../../app/appSlice.ts"
import { handleServerAppError } from "../../../../../common/utils/handleServerAppError.ts"
import { handleServerNetworkError } from "../../../../../common/utils/handleServerNetworkError.ts"
import { AddTodolistActionType, RemoveTodolistActionType } from "../todolists/todolistsSlice.ts"

export type TaskProps = {
  id: string,
  title: string,
  isDone: boolean,
}

export type TasksStateType = {
  [key: string]: Array<DomainTask>
}

export const getTasksAC = (payload: { todolistId: string, tasks: DomainTask[] }) => {
  return { type: "GET-TASKS", payload } as const
}

export const removeTaskAC = (payload: { todolistId: string, taskId: string }) => {
  return { type: "REMOVE-TASK", payload } as const
}

export const addTackAC = (payload: { task: DomainTask }) => {
  return { type: "ADD-TASK", payload } as const
}

export const updateTaskAC = (payload: { todolistId: string, taskId: string, domainModel: DomainTask }) => {
  return { type: "UPDATE-TACK", payload } as const
}

export const clearTasksAC = () => {
  return { type: "CLEAR-TASKS" } as const
}

// Actions types
export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type AddTaskActionType = ReturnType<typeof addTackAC>

type ActionsType =
  RemoveTaskActionType
  | AddTaskActionType
  | AddTodolistActionType
  | RemoveTodolistActionType
  | ReturnType<typeof getTasksAC>
  | ReturnType<typeof updateTaskAC>
  | ReturnType<typeof clearTasksAC>

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
  switch (action.type) {
    case "GET-TASKS": {
      const stateCopy = { ...state }
      stateCopy[action.payload.todolistId] = action.payload.tasks
      return stateCopy
    }
    case "ADD-TASK": {
      // debugger
      console.log(action)
      const newTask = action.payload.task

      return {
        ...state,
        [newTask.todoListId]: [newTask, ...state[newTask.todoListId]]
      }
    }
    case "REMOVE-TASK": {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].filter((todo: TaskProps) => todo.id !== action.payload.taskId)
      }
    }
    case "UPDATE-TACK": {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].map(todo =>
          todo.id === action.payload.taskId
            ? {
              ...todo,
              ...action.payload.domainModel
            }
            : todo
        )
      }
    }
    case "ADD-TODOLIST":
      return { ...state, [action.payload.todolist.id]: [] }
    case "REMOVE-TODOLIST":
      delete state[action.payload.id]
      return { ...state }
    case "CLEAR-TASKS":
      return {}
    default:
      return state
  }
}

export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({status: 'loading'}))
  tasksApi.getTasks(todolistId).then(res => {
    const tasks = res.data.items
    dispatch(setAppStatus({status: 'success'}))
    dispatch(getTasksAC({ todolistId, tasks }))
  })
    .catch(error => {
      handleServerNetworkError(error, dispatch)
    })
}

export const removeTaskTC = (args: { todolistId: string, taskId: string }) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({status: 'loading'}))
  tasksApi.deleteTask(args).then(res => {
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(setAppStatus({status: 'success'}))
      dispatch(removeTaskAC(args))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  })
    .catch(error => {
      handleServerNetworkError(error, dispatch)
    })
}

export const createTaskTC = (args: { todolistId: string, title: string }) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({status: 'loading'}))
  tasksApi
    .createTask(args)
    .then(res => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setAppStatus({status: 'success'}))
        dispatch(addTackAC({ task: res.data.data.item }))
      } else {
        handleServerAppError(res.data, dispatch)
      }

    })
    .catch(error => {
      handleServerNetworkError(error, dispatch)
    })
}

export const updateTaskTC = (args: { todolistId: string, taskId: string, domainModel: UpdateTaskDomainModel }) =>
  (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(setAppStatus({status: 'loading'}))
    const { todolistId, domainModel, taskId } = args

    const allTasksFromState = getState().tasks
    const tasksForCurrentTodolist = allTasksFromState[todolistId]
    const task = tasksForCurrentTodolist.find(todo => todo.id === taskId)

    if (task) {
      const model: UpdateTaskModel = {
        status: task.status,
        title: task.title,
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        ...domainModel
      }
      tasksApi.updateTask({ taskId, todolistId, model }).then((res) => {
        if (res.data.resultCode === ResultCode.Success) {
          dispatch(setAppStatus({status: 'success'}))
          dispatch(updateTaskAC(args))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
        .catch(error => {
          handleServerNetworkError(error, dispatch)
        })
    }
  }
