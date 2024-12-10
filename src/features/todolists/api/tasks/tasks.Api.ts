import { instance } from "../../../../common/instance/instance.ts"
import { DomainTask, GetTasksResponse, UpdateTaskModel } from "./tasksApi.types.ts"
import { BaseResponse } from "common/types"


export const tasksApi = {
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`/todo-lists/${todolistId}/tasks`)
  },
  createTask(payload: { todolistId: string, title: string }) {
    const {todolistId, title} = payload
    return instance.post<BaseResponse<{item: DomainTask }>>(`/todo-lists/${todolistId}/tasks`, {title})
  },
  updateTask(payload: { todolistId: string, taskId: string, model: UpdateTaskModel}) {
    const {todolistId, model, taskId} = payload
    return instance.put<BaseResponse<{item: DomainTask}>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
  deleteTask(payload: { todolistId: string, taskId: string }) {
    const {todolistId, taskId} = payload
    return instance.delete<BaseResponse>(`/todo-lists/${todolistId}/tasks/${taskId}`)
  }
}