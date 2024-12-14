import { LoginArgs } from "./authApi.types.ts"
import { instance } from "./../../../common/instance"
import { BaseResponse } from "./../../../common/types"

export const authApi = {
  login(payload: LoginArgs) {
    return instance.post<BaseResponse<{userId: number, token: string}>>(`auth/login`, payload)
  },
  logout() {
    return instance.delete<BaseResponse>(`auth/logout`)
  }
}