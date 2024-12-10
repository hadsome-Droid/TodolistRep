
import {
    Todolist,
} from "./todolistsApi.types.ts";
import {instance} from "../../../common/instance/instance";
import {BaseResponse} from "common/types";


export const todolistsApi = {
    getTodolists() {
        return instance.get<Todolist[]>('todo-lists')
    },
    updateTodolist(payload: { id: string, title: string }) {
        return instance.put<BaseResponse>(`todo-lists/${payload.id}`, {title: payload.title})
    },
    createTodolist(title: string){
        return instance.post<BaseResponse<{item: Todolist}>>('todo-lists', {title})
    },
    deleteTodolist(id: string) {
        return instance.delete<BaseResponse>(`todo-lists/${id}`)
    }
}