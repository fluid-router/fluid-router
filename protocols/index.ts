type ScreenOptions = {
    screenProps: object
    animationConfig: {
        display: (direction: Direction) => void
        dismiss: (direction: Direction) => void
    }
}

enum Direction {
    inFlow,
    backFlow
}

interface FluidScreen {
    onFocus: (direction: Direction) => void
    onBlur: (direction: Direction) => void
    active: boolean
    // use react hook detect destory
}

interface Fluidization {
    pushScreen: (screens: typeof Screen, screenOptions: ScreenOptions) => void
    replaceScreen: (screens: typeof Screen, screenOptions: ScreenOptions, index?: number) => void
    // go: (index: number) => void
    // forward: () => void
    // back: Function
    didStart: Function
    isDetroy: boolean

    finish: Function
    
    
}

abstract class FluidRoute implements Fluidization {
    replaceScreen
    popScreen
    didStart
    pushScreen
    isDetroy: boolean
    entry: string
    abstract start: () => void
    abstract finish: () => void
    abstract back: () => void
    go: () => void
    forward: () => void
}

// abstract class Fluid implements Fluidization {
//     isDetroy: boolean
//     replaceScreen = (screens: typeof Screen, ...any) => {
//         if (this.isDetroy) {
//             return
//         }
//     }
//     pushScreen = (screens: typeof Screen, ...any) => {
//         if (this.isDetroy) {
//             return
//         }
//     }
//     popScreen
//     didStart
//     done
//     endFlow

//     start: () => void
//     finish: () => void
//     back: () => void
//     go: () => void
//     forward: () => void
// }
