import React from "react"
import { Dispatch } from "redux"
import { setAppErrorAC, setAppStatusAC } from "../../app/app-reducer.ts"

export const handleServerNetworkError = (error: {message: string}, dispatch: Dispatch) => {
  dispatch(setAppErrorAC(error.message))
  dispatch(setAppStatusAC('failed'))
}
