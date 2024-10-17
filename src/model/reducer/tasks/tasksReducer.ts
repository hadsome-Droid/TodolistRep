import {TaskProps} from "../../../App.tsx";
import {v4 as uuidv4} from "uuid";
import {TasksStateType} from "../../../AppWithReducers.tsx";


export const removeTaskAC = (payload: { todolistId: string, taskId: string }) => {
    return {type: 'REMOVE-TASK', payload} as const
}

export const addTackAC = (payload: { todolistId: string, title: string }) => {
    return {type: 'ADD-TASK', payload} as const
}

export const changeTaskTitleAC = (payload: { todolistId: string, taskId: string, title: string }) => {
    return {type: 'CHANGE-TASK-TITLE', payload} as const
}

export const changeTaskStatusAC = (payload: { todolistId: string, taskId: string, isDone: boolean }) => {
    return {type: 'CHANGE-TASK-STATUS', payload} as const
}

// Actions types
export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type AddTaskActionType = ReturnType<typeof addTackAC>
export type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>
export type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST'
    payload: {
        todolistId: string
        title: string
    }
}
export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST'
    payload: {
        id: string
    }
}

type ActionsType =
     RemoveTaskActionType
    | AddTaskActionType
    | ChangeTaskTitleActionType
    | ChangeTaskStatusActionType
    | AddTodolistActionType
    | RemoveTodolistActionType

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'ADD-TASK': {
            // debugger
            console.log(action)
            const newTask: TaskProps = {
                id: uuidv4(),
                title: action.payload.title,
                isDone: false,
            }

            return {
                ...state,
                [action.payload.todolistId]: [newTask, ...state[action.payload.todolistId]]
            }
        }
        case "REMOVE-TASK": {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter((todo: TaskProps) => todo.id !== action.payload.taskId)
            }
        }
        case 'CHANGE-TASK-STATUS': {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map(
                    (task: TaskProps) => task.id === action.payload.taskId ? {
                        ...task,
                        isDone: action.payload.isDone
                    } : task)
            }
        }
        case 'CHANGE-TASK-TITLE': {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map(
                    (task: TaskProps) => task.id === action.payload.taskId ? {
                        ...task,
                        title: action.payload.title
                    } : task)
            }
        }
        case "ADD-TODOLIST":
            return {...state, [action.payload.todolistId]: []}
        case "REMOVE-TODOLIST":
            delete state[action.payload.id]
            return {...state}
        default:
            return state
    }
}

