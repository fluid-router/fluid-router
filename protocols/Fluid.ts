interface Fluid {
    pushScreen: (screens: typeof Screen, screenOptions: ScreenOptions) => void
    replaceScreen: (screens: typeof Screen, screenOptions: ScreenOptions) => void
    // emit: (type: string, serializableParams: object) => void
    popAllScreens: () => void
    // getHistoryScreenStack: () => ScreenDelegate[]
}

interface ScreenDelegate {
    pushModal: (screens: typeof Screen, screenOptions: ScreenOptions, index?: number) => void
    popModal: (screens: typeof Screen, screenOptions: ScreenOptions, index?: number) => void
}

interface Switcher {
    
}