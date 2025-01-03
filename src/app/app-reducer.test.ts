import {appSlice, changeThemeAC, ThemeMode} from "./appSlice.ts";



test('switch theme should be light', () => {
    const startState = {
        themeMode: 'dark' as ThemeMode,
    }

    const endState = appSlice(startState, changeThemeAC('light'))

    expect(endState.themeMode).toEqual('light')
})