import { BaseResponse } from "common/types"
import { Dispatch } from "redux"
import { setAppError, setAppStatus } from "../../app/appSlice.ts"

export const handleServerAppError = <T, >(data: BaseResponse<T>, dispatch: Dispatch) => {
  if (data.messages.length) {
    // dispatch(setAppErrorAC(data.messages[0]))
    dispatch(setAppError({error: data.messages[0] }))
  } else {
    // dispatch(setAppErrorAC("Some error occurred"))
    dispatch(setAppError({error: "Some error occurred" }))
  }
  // dispatch(setAppStatusAC('failed'))
  dispatch(setAppStatus({ status: "failed" }))
}
