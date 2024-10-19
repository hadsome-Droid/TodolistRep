export type ThemeMode = 'dark' | 'light'

type InitialState = typeof initialState

const initialState = {
    themeMode: 'dark' as ThemeMode,
}

type ActionType = ReturnType<typeof changeThemeAC>

export const appReducer = (state: InitialState = initialState, action: ActionType) => {
    switch (action.type) {
        case 'CHANGE_THEME': {
            return {
                ...state,
                themeMode: action.payload.themeMode,
            }
        }
        default:
            return state
    }
}

export const changeThemeAC = (themeMode: ThemeMode) => {
    return {type: 'CHANGE_THEME', payload: {themeMode}} as const
}