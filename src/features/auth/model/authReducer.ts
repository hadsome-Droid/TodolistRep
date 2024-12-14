import { LoginArgs } from "../api/authApi.types.ts"
import { Dispatch } from "redux"
import { setAppStatusAC } from "../../../app/app-reducer.ts"
import { authApi } from "../api/authApi.ts"
import { ResultCode } from "./../../../common/enums/enums.ts"
import { handleServerAppError } from "./../../../common/utils/handleServerAppError.ts"
import { handleServerNetworkError } from "./../../../common/utils/handleServerNetworkError.ts"


type InitialStateType = typeof initialState;

const initialState = {
  isLoggedIn: false
}

type ActionTypes = ReturnType<typeof setIsLoggedInAC>;

export const authReducer = (
  state: InitialStateType = initialState,
  action: ActionTypes
): InitialStateType => {
  switch (action.type) {
    case "SET_IS_LOGGED_IN":{
      return {
        ...state,
        isLoggedIn: action.payload.isLoggedIn
      }
    }
    default: {
      return state;
    }
  }
}

const setIsLoggedInAC = (isLoggedIn: boolean) => {
  return { type: "SET_IS_LOGGED_IN", payload: { isLoggedIn } } as const
}

export const loginTC = (data: LoginArgs) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"))
  authApi.login(data).then(res => {
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(setAppStatusAC("success"))
      dispatch(setIsLoggedInAC(true))
      localStorage.setItem("sn-token", res.data.data.token)
    } else {
      handleServerAppError(res.data, dispatch)
    }
  }).catch(error => {
    handleServerNetworkError(error, dispatch)
  })
}

export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"))
  authApi.logout().then(res => {
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(setAppStatusAC("success"))
      dispatch(setIsLoggedInAC(false))
      localStorage.removeItem("sn-token")
    } else {
      handleServerAppError(res.data, dispatch)
    }
  }).catch(error => {
    handleServerNetworkError(error, dispatch)
  })
}