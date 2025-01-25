import { DomainTask, GetTasksResponse, UpdateTaskModel } from "./tasksApi.types.ts"
import { BaseResponse } from "common/types"
import { baseApi } from "../../../../app/baseApi.ts"

export const tasksApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getTasks: build.query<GetTasksResponse, string>({
      query: (todolistId) => `todo-lists/${todolistId}/tasks`,
      providesTags: (res, err, todolistId) =>
        res
          ? [
            ...res.items.map(({ id }) => ({ type: "Task", id }) as const),
            { type: "Task", id: todolistId }
          ] : ["Task"]
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
      invalidatesTags: (res, err, { taskId }) => [{ type: "Task", id: taskId }]
    }),
    removeTask: build.mutation<BaseResponse, { todolistId: string, taskId: string }>({
      query: ({ todolistId, taskId }) => {
        return {
          method: "DELETE",
          url: `todo-lists/${todolistId}/tasks/${taskId}`
        }
      },
      invalidatesTags: (res, err, { taskId }) => [{ type: "Task", id: taskId }]
    })
  })
})

export const { useRemoveTaskMutation, useUpdateTaskMutation, useGetTasksQuery, useCreateTaskMutation } = tasksApi