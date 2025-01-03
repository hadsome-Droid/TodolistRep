import React from "react"
import { Dispatch } from "redux"
import { setAppError, setAppErrorAC, setAppStatus, setAppStatusAC } from "../../app/appSlice.ts"

export const handleServerNetworkError = (error: {message: string}, dispatch: Dispatch) => {
  dispatch(setAppError({error: error.message }))
  // dispatch(setAppErrorAC(error.message))
  // dispatch(setAppStatusAC('failed'))
  dispatch(setAppStatus({status: "failed" }))
}
