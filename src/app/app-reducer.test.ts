import {appReducer, changeThemeAC, ThemeMode} from "./app-reducer.ts";



test('switch theme should be light', () => {
    const startState = {
        themeMode: 'dark' as ThemeMode,
    }

    const endState = appReducer(startState, changeThemeAC('light'))

    expect(endState.themeMode).toEqual('light')
})