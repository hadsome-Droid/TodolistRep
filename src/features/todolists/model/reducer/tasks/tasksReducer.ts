import { v4 as uuidv4 } from "uuid"
import { Dispatch } from "redux"
import { tasksApi } from "../../../api/tasks/tasks.Api.ts"
import { DomainTask, UpdateTaskDomainModel, UpdateTaskModel } from "../../../api/tasks/tasksApi.types.ts"
import { TaskPriority, TaskStatus } from "../../../../../common/enums/enums.ts"
import { RootState } from "../../../../../app/store.ts"

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

// Actions types
export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type AddTaskActionType = ReturnType<typeof addTackAC>
export type AddTodolistActionType = {
  type: "ADD-TODOLIST"
  payload: {
    todolistId: string
    title: string
  }
}
export type RemoveTodolistActionType = {
  type: "REMOVE-TODOLIST"
  payload: {
    id: string
  }
}

type ActionsType =
  RemoveTaskActionType
  | AddTaskActionType
  | AddTodolistActionType
  | RemoveTodolistActionType
  | ReturnType<typeof getTasksAC>
  | ReturnType<typeof updateTaskAC>

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
      return { ...state, [action.payload.todolistId]: [] }
    case "REMOVE-TODOLIST":
      delete state[action.payload.id]
      return { ...state }
    default:
      return state
  }
}

export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
  tasksApi.getTasks(todolistId).then(res => {
    const tasks = res.data.items
    dispatch(getTasksAC({ todolistId, tasks }))
  })
}

export const removeTaskTC = (args: { todolistId: string, taskId: string }) => (dispatch: Dispatch) => {
  tasksApi.deleteTask(args).then(res => {
    dispatch(removeTaskAC(args))
  })
}

export const createTaskTC = (args: { todolistId: string, title: string }) => (dispatch: Dispatch) => {
  tasksApi.createTask(args).then(res => {
    dispatch(addTackAC({ task: res.data.data.item }))
  })
}

export const updateTaskTC = (args: {todolistId: string, taskId: string, domainModel: UpdateTaskDomainModel}) =>
  (dispatch: Dispatch, getState: () => RootState) => {
  const {todolistId, domainModel, taskId} = args

    const allTasksFromState = getState().tasks
    const tasksForCurrentTodolist = allTasksFromState[todolistId]
    const task = tasksForCurrentTodolist.find(todo => todo.id === taskId)

    if(task) {
      const model: UpdateTaskModel = {
        status: task.status,
        title: task.title,
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        ...domainModel,
      }
      tasksApi.updateTask({ taskId, todolistId, model }).then((res) => {
        dispatch(updateTaskAC(args))
      })
    }
}
