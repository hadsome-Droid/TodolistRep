import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setAppError } from "./appSlice.ts"
import { ResultCode } from "./../common/enums/enums.ts"

function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error != null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  )
}

export const baseApi = createApi({
  reducerPath: "todolistsApi",
  tagTypes: ["Todolist", "Task"],
  baseQuery: async (args, api, extraOptions) => {
    const result = await fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      prepareHeaders: headers => {
        headers.set("API-KEY", `${import.meta.env.VITE_API_KEY}`)
        headers.set("Authorization", `Bearer ${localStorage.getItem("sn-token")}`)
      }
    })(args, api, extraOptions)

    // if (result.error) {
    //   if (result.error.status === "FETCH_ERROR") {
    //     api.dispatch(setAppError({ error: result.error.error }))
    //   }
    //
    //   if (result.error.status === "PARSING_ERROR") {
    //     api.dispatch(setAppError({ error: result.error.error }))
    //   }
    //
    //   if(result.error.status === 403) {
    //     api.dispatch(setAppError({ error: '403 Forbidden Error. Check API-KEY' }))
    //   }
    //
    //   if (result.error.status === 400) {
    //     // ✅ 1 var: Type Assertions
    //     api.dispatch(setAppError({ error: (result.error.data as { message: string }).message }))
    //
    //     // ✅ 2 var:  JSON.stringify
    //     // error = JSON.stringify(result.error.data)
    //
    //     // ✅ 3 var: Type Predicate
    //     // if (isErrorWithMessage(result.error.data)) {
    //     //   error = result.error.data.message
    //     // } else {
    //     //   error = JSON.stringify(result.error.data)
    //     // }
    //   }
    //
    //   if (result.error.status === 500) {
    //     if (isErrorWithMessage(result.error.data)) {
    //       api.dispatch(setAppError({error: (result.error.data as { message: string }).message}))
    //       // error = result.error.data.message
    //     } else {
    //       api.dispatch(setAppError({error: JSON.stringify(result.error.data)}))
    //       // error = JSON.stringify(result.error.data)
    //     }
    //   }
    // }


    let error = 'Some error occurred'

    if (result.error) {
      switch (result.error.status) {
        case 'FETCH_ERROR':
        case 'PARSING_ERROR':
        case 'CUSTOM_ERROR':
          error = result.error.error
          break

        case 403:
          error = '403 Forbidden Error. Check API-KEY'
          break

        case 400:
        case 500:
          if (isErrorWithMessage(result.error.data)) {
            error = result.error.data.message
          } else {
            error = JSON.stringify(result.error.data)
          }
          break

        default:
          error = JSON.stringify(result.error)
          break
      }
      api.dispatch(setAppError({ error }))
    }

    if ((result.data as { resultCode: ResultCode }).resultCode === ResultCode.Error) {
      const messages = (result.data as { messages: string[] }).messages
      error = messages.length ? messages[0] : error
      api.dispatch(setAppError({ error }))
    }

    return result
  },
  endpoints: () => ({})
})