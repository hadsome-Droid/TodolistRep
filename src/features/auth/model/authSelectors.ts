import { RootState } from "../../../app/store.ts"

export const selectLoggedIn = (state: RootState) => state.auth?.isLoggedIn