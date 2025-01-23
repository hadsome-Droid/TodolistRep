import {
  DomainTodolist,
  Todolist
} from "./todolistsApi.types.ts"
import { instance } from "../../../common/instance/instance.ts"
import { BaseResponse } from "./../../../common/types"
import { BaseQueryArg, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { build } from "vite"
import { baseApi } from "../../../app/baseApi.ts"


// export const _todolistsApi = {
//   getTodolists() {
//     return instance.get<Todolist[]>("todo-lists")
//   },
//   updateTodolist(payload: { id: string, title: string }) {
//     return instance.put<BaseResponse>(`todo-lists/${payload.id}`, { title: payload.title })
//   },
//   createTodolist(title: string) {
//     return instance.post<BaseResponse<{ item: Todolist }>>("todo-lists", { title })
//   },
//   deleteTodolist(id: string) {
//     return instance.delete<BaseResponse>(`todo-lists/${id}`)
//   }
// }

export const todolistsApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getTodolists: build.query<DomainTodolist[], void>({
      query: () => "todo-lists",
      transformResponse: (todolists: Todolist[]): DomainTodolist[] => {
        return todolists.map(todos => ({ ...todos, filter: "all", entityStatus: "idle" }))
      },
      providesTags: ["Todolist"]
    }),
    createTodolist: build.mutation<BaseResponse<{ item: Todolist }>, string>({
      query(title) {
        return {
          url: "todo-lists",
          method: "POST",
          body: { title }
        }
      },
      invalidatesTags: ["Todolist"]
    }),
    removeTodolist: build.mutation<BaseResponse, string>({
      query(id) {
        return {
          method: "DELETE",
          url: `todo-lists/${id}`
        }
      },
      invalidatesTags: ["Todolist"]
    }),
    updateTodolist: build.mutation<BaseResponse, { id: string, title: string }>({
      query({ id, title }) {
        return {
          method: "PUT",
          url: `todo-lists/${id}`,
          body: { title }
        }
      },
      invalidatesTags: ["Todolist"]
    })
  })
})

export const {
  useGetTodolistsQuery,
  useCreateTodolistMutation,
  useRemoveTodolistMutation,
  useUpdateTodolistMutation
} = todolistsApi