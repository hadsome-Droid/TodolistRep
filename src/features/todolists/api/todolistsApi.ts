import {
  DomainTodolist,
  Todolist
} from "./todolistsApi.types.ts"
import { baseApi } from "../../../app/baseApi.ts"
import { BaseResponse } from "./../../../common/types"

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