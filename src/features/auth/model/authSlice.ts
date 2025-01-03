import { LoginArgs } from "../api/authApi.types.ts"
import { Dispatch } from "redux"
import { setAppStatus } from "../../../app/appSlice.ts"
import { authApi } from "../api/authApi.ts"
import { ResultCode } from "./../../../common/enums/enums.ts"
import { handleServerAppError } from "./../../../common/utils/handleServerAppError.ts"
import { handleServerNetworkError } from "./../../../common/utils/handleServerNetworkError.ts"
import { clearTasksAC } from "../../todolists/model/reducer/tasks/tasksReducer.ts"
import { clearTodolistsAC } from "../../todolists/model/reducer/todolists/todolistsSlice.ts"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"


type InitialStateType = typeof initialState;

const initialState = {
  isLoggedIn: false,
  isInitialized: false
}

type ActionTypes = ReturnType<typeof setIsLoggedInAC> | ReturnType<typeof setIsInitializedAC>;

export const authSlice = createSlice({
  name: "auth",
  initialState,
  // reducers: {
  //   setIsLoggedIn: (state, action: PayloadAction<{isLoggedIn: boolean}>) => {
  //     state.isLoggedIn = action.payload.isLoggedIn
  //   },
  //   setIsInitialized: (state, action: PayloadAction<{isInitialized: boolean}>) => {
  //     state.isInitialized = action.payload.isInitialized
  //   },
  // },
  reducers: create => ({
    setIsLoggedIn: create.reducer<{isLoggedIn: boolean}>((state, action) => {
      state.isInitialized = action.payload.isLoggedIn
    }),
    setIsInitialized: create.reducer<{isInitialized: boolean}>((state, action) => {
      state.isInitialized = action.payload.isInitialized
    })
  })
})

export const {setIsLoggedIn, setIsInitialized} = authSlice.actions
export const authReducer = authSlice.reducer

// export const authSlice = (
//   state: InitialStateType = initialState,
//   action: ActionTypes
// ): InitialStateType => {
//   switch (action.type) {
//     case "SET_IS_LOGGED_IN": {
//       return {
//         ...state,
//         isLoggedIn: action.payload.isLoggedIn
//       }
//     }
//     case "SET_IS_INITIALIZED": {
//       return {
//         ...state,
//         isInitialized: action.payload.isInitialized
//       }
//     }
//     default: {
//       return state
//     }
//   }
// }

const setIsLoggedInAC = (isLoggedIn: boolean) => {
  return { type: "SET_IS_LOGGED_IN", payload: { isLoggedIn } } as const
}

const setIsInitializedAC = (isInitialized: boolean) => {
  return { type: "SET_IS_INITIALIZED", payload: { isInitialized } } as const
}

export const loginTC = (data: LoginArgs) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({status: "loading" }))
  authApi.login(data).then(res => {
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(setAppStatus({status: "success" }))
      // dispatch(setIsLoggedInAC(true))
      dispatch(setIsLoggedIn({isLoggedIn: true}))
      localStorage.setItem("sn-token", res.data.data.token)
    } else {
      handleServerAppError(res.data, dispatch)
    }
  }).catch(error => {
    handleServerNetworkError(error, dispatch)
  })
}

export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: 'loading' }))
  authApi.logout().then(res => {
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(setAppStatus({ status: "success" }))
      dispatch(setIsLoggedInAC(false))
      dispatch(clearTasksAC())
      dispatch(clearTodolistsAC())
      localStorage.removeItem("sn-token")
    } else {
      handleServerAppError(res.data, dispatch)
    }
  }).catch(error => {
    handleServerNetworkError(error, dispatch)
  })
}

export const initializeAppTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatus({status: "loading"}))
  authApi.me().then(res => {
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(setAppStatus({status: 'success'}))
      dispatch(setIsLoggedInAC(true))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  }).catch(error => {
    handleServerNetworkError(error, dispatch)
  }).finally(() => {
    dispatch(setIsInitializedAC(true))
  })
}