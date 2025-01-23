import { instance } from "../../../../common/instance/instance.ts"
import { DomainTask, GetTasksResponse, UpdateTaskModel } from "./tasksApi.types.ts"
import { BaseResponse } from "common/types"
import { baseApi } from "../../../../app/baseApi.ts"
import { BaseQueryArg } from "@reduxjs/toolkit/query/react"


export const _tasksApi = {
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`/todo-lists/${todolistId}/tasks`)
  },
  createTask(payload: { todolistId: string, title: string }) {
    const { todolistId, title } = payload
    return instance.post<BaseResponse<{ item: DomainTask }>>(`/todo-lists/${todolistId}/tasks`, { title })
  },
  updateTask(payload: { todolistId: string, taskId: string, model: UpdateTaskModel }) {
    const { todolistId, model, taskId } = payload
    return instance.put<BaseResponse<{ item: DomainTask }>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
  deleteTask(payload: { todolistId: string, taskId: string }) {
    const { todolistId, taskId } = payload
    return instance.delete<BaseResponse>(`/todo-lists/${todolistId}/tasks/${taskId}`)
  }
}

export const tasksApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getTasks: build.query<GetTasksResponse, string>({
      query: (todolistId) => `todo-lists/${todolistId}/tasks`,
      providesTags: ["Task"]
    }),
    createTask: build.mutation<BaseResponse<{ item: DomainTask }>, { todolistId: string, title: string }>({
      query: ({ todolistId, title }) => {
        return {
          method: "POST",
          url: `todo-lists/${todolistId}/tasks`,
          body: {
            title
          }
        }
      },
      invalidatesTags: ["Task"]
    }),
    updateTask: build.mutation<
      BaseResponse<{ item: DomainTask }>,
      { todolistId: string, taskId: string, model: UpdateTaskModel }
    >({
      query: ({ todolistId, taskId, model }) => {
        return {
          method: "PUT",
          url: `todo-lists/${todolistId}/tasks/${taskId}`,
          body: model
        }
      },
      invalidatesTags: ["Task"]
    }),
    removeTask: build.mutation<BaseResponse, { todolistId: string, taskId: string }>({
      query: ({ todolistId, taskId }) => {
        return {
          method: "DELETE",
          url: `todo-lists/${todolistId}/tasks/${taskId}`
        }
      },
      invalidatesTags: ["Task"]
    })
  })
})

export const {useRemoveTaskMutation, useUpdateTaskMutation, useGetTasksQuery, useCreateTaskMutation} = tasksApi