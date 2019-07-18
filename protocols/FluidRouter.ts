interface Fluid {
    pushScreen: (screens: typeof Screen, screenOptions: ScreenOptions) => void
    replaceScreen: (screens: typeof Screen, screenOptions: ScreenOptions) => void
    getHistoryScreenStack: () => unknown
}
