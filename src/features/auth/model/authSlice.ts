import { LoginArgs } from "../api/authApi.types.ts"
import { Dispatch } from "redux"
import { setAppStatus } from "../../../app/appSlice.ts"
import { authApi } from "../api/authApi.ts"
import { ResultCode } from "./../../../common/enums/enums.ts"
import { handleServerAppError } from "./../../../common/utils/handleServerAppError.ts"
import { handleServerNetworkError } from "./../../../common/utils/handleServerNetworkError.ts"
import { clearTasks } from "../../todolists/model/reducer/tasks/tasksSlice.ts"
import { clearTodolists } from "../../todolists/model/reducer/todolists/todolistsSlice.ts"
import { asyncThunkCreator, buildCreateSlice, createSlice } from "@reduxjs/toolkit"

const initialState = {
  isLoggedIn: false,
  isInitialized: false
}

const createSliceWithThunks = buildCreateSlice({ creators: { asyncThunk: asyncThunkCreator } })

export const authSlice = createSliceWithThunks({
  name: "auth",
  initialState,
  selectors: {
    selectIsLoggedIn: state => state.isLoggedIn,
    selectIsInitialized: state => state.isInitialized
  },
  // reducers: {
  //   setIsLoggedIn: (state, action: PayloadAction<{isLoggedIn: boolean}>) => {
  //     state.isLoggedIn = action.payload.isLoggedIn
  //   },
  //   setIsInitialized: (state, action: PayloadAction<{isInitialized: boolean}>) => {
  //     state.isInitialized = action.payload.isInitialized
  //   },
  // },
  reducers: create => {
    const createAThunk = create.asyncThunk.withTypes<{ rejectValue: null }>()
    return {
      initializeApp: createAThunk(
        async (_, { dispatch, rejectWithValue }) => {
          try {
            dispatch(setAppStatus({ status: "loading" }))
            const res = await authApi.me()
            if (res.data.resultCode === ResultCode.Success) {
              dispatch(setAppStatus({ status: "success" }))
              return { isLoggedIn: true }
            } else {
              handleServerAppError(res.data, dispatch)
              return rejectWithValue(null)
            }
          } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
          },
          settled: (state) => {
            state.isInitialized = true
          }
        }
      ),
      login: createAThunk(
        async (data: LoginArgs, { dispatch, rejectWithValue }) => {
          try {
            dispatch(setAppStatus({ status: "loading" }))
            const res = await authApi.login(data)
            if (res.data.resultCode === ResultCode.Success) {
              dispatch(setAppStatus({ status: "success" }))
              localStorage.setItem("sn-token", res.data.data.token)
              return { isLoggedIn: true }
            } else {
              handleServerAppError(res.data, dispatch)
              return rejectWithValue(null)
            }
          } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
          }
        }
      ),
      logOut: createAThunk(
        async (_, { dispatch, rejectWithValue }) => {
          try {
            dispatch(setAppStatus({ status: "loading" }))
            const res = await authApi.logout()
            if (res.data.resultCode === ResultCode.Success) {
              dispatch(setAppStatus({ status: "success" }))
              dispatch(clearTasks())
              dispatch(clearTodolists())
              localStorage.removeItem("sn-token")
              return { isLoggedIn: false }
            } else {
              handleServerAppError(res.data, dispatch)
              return rejectWithValue(null)
            }
          } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
          }
        }
      )
      // setIsLoggedIn: create.reducer<{ isLoggedIn: boolean }>((state, action) => {
      //   state.isLoggedIn = action.payload.isLoggedIn
      // }),
      // setIsInitialized: create.reducer<{ isInitialized: boolean }>((state, action) => {
      //   state.isInitialized = action.payload.isInitialized
      // })
    }
  }
})

// export const { setIsLoggedIn, setIsInitialized } = authSlice.actions
export const { login, logOut, initializeApp } = authSlice.actions
export const { selectIsLoggedIn, selectIsInitialized } = authSlice.selectors
export const authReducer = authSlice.reducer

// export const loginTC = (data: LoginArgs) => (dispatch: Dispatch) => {
//   dispatch(setAppStatus({ status: "loading" }))
//   authApi.login(data).then(res => {
//     if (res.data.resultCode === ResultCode.Success) {
//       dispatch(setAppStatus({ status: "success" }))
//       // dispatch(setIsLoggedInAC(true))
//       dispatch(setIsLoggedIn({ isLoggedIn: true }))
//       localStorage.setItem("sn-token", res.data.data.token)
//     } else {
//       handleServerAppError(res.data, dispatch)
//     }
//   }).catch(error => {
//     handleServerNetworkError(error, dispatch)
//   })
// }
//
// export const logoutTC = () => (dispatch: Dispatch) => {
//   dispatch(setAppStatus({ status: "loading" }))
//   authApi.logout().then(res => {
//     if (res.data.resultCode === ResultCode.Success) {
//       dispatch(setAppStatus({ status: "success" }))
//       dispatch(setIsLoggedIn({ isLoggedIn: false }))
//       dispatch(clearTasks())
//       dispatch(clearTodolists())
//       localStorage.removeItem("sn-token")
//     } else {
//       handleServerAppError(res.data, dispatch)
//     }
//   }).catch(error => {
//     handleServerNetworkError(error, dispatch)
//   })
// }
//
// export const initializeAppTC = () => (dispatch: Dispatch) => {
//   dispatch(setAppStatus({ status: "loading" }))
//   authApi.me().then(res => {
//     if (res.data.resultCode === ResultCode.Success) {
//       dispatch(setAppStatus({ status: "success" }))
//       dispatch(setIsLoggedIn({ isLoggedIn: true }))
//     } else {
//       handleServerAppError(res.data, dispatch)
//     }
//   }).catch(error => {
//     handleServerNetworkError(error, dispatch)
//   }).finally(() => {
//     dispatch(setIsInitialized({ isInitialized: true }))
//   })
// }