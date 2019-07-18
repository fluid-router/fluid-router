import { createHistoryKey, isEditableHistoryState } from './utils'
import { isKey, isIndex, getHashPath, getAbsolutePath } from './utils'
import { stripTrailingSlash, addLeadingSlash } from './history-utils/PathUtils'
import { observable, toJS } from 'mobx'

const PopStateEvent = 'popstate'
const rawHistory = window.history

type ScreenStateObject = {
    k: string //history key
    s: unknown // business state
    l: string // `window.location.pathname` or `hash`
}

type HistoryState = {
    eh_ck: string // current key
    eh_sl: ScreenStateObject[] // screen state list
}

type HistoryEditorProps = {
    basename?: string
    initState?: unknown
    useHash: boolean
}

type PushParams = {
    state?: unknown
    url?: string
    keyOrIndex?: string | number
}

type ReplaceParams = {
    state?: unknown
    url?: string
    keyOrIndex?: string | number
}

export class HistoryEditor {
    private historyState: HistoryState
    private basename = ''
    private useHash = false
    constructor({ basename = '', initState = null, useHash = false }: HistoryEditorProps) {
        this.basename = basename ? stripTrailingSlash(addLeadingSlash(basename)) : ''
        this.useHash = useHash
        window.addEventListener(PopStateEvent, this.handlerRawHistoryState)

        if (isEditableHistoryState(rawHistory.state)) {
            this.historyState = observable(rawHistory.state)
        } else {
            const historyKey = createHistoryKey()
            const newHistoryState = {
                eh_ck: historyKey,
                eh_sl: [
                    {
                        k: historyKey,
                        s: initState,
                        l: this.useHash ? getHashPath() : window.location.pathname
                    }
                ]
            }
            this.historyState = observable(newHistoryState)
            rawHistory.replaceState(toJS(this.historyState), '')
        }
    }

    predictionAction?: {
        key: string
        cb?: Function
    }

    indexOf = (keyOrIndex: string | number): number => {
        if (isKey(keyOrIndex)) {
            return this.historyState.eh_sl.findIndex(stateObject => {
                return stateObject.k === keyOrIndex
            })
        } else if (isIndex(keyOrIndex)) {
            if (this.historyState.eh_sl[keyOrIndex as number]) {
                return keyOrIndex as number
            } else {
                return -1
            }
        } else {
            return -1
        }
    }

    indexOfActive = () => {
        return this.historyState.eh_sl.findIndex(stateObject => {
            return stateObject.k === this.historyState.eh_ck
        })
    }

    cutHitoryList = (topKey: string) => {
        const topIndex = this.historyState.eh_sl.findIndex(s => {
            return s.k === topKey
        })
        if (topIndex > -1) {
            this.historyState.eh_sl.splice(
                topIndex + 1,
                this.historyState.eh_sl.length - topIndex - 1
            )
        }
    }

    isBack = (key: string) => {
        return this.historyList.eh_sl.some(s => {
            return s.k === key
        })
    }

    handlerRawHistoryState = (ev: PopStateEvent) => {
        const { eh_ck = undefined, eh_sl = undefined } = ev.state || {}
        if (this.predictionAction && this.predictionAction.key === eh_ck) {
            const cb = this.predictionAction.cb
            this.predictionAction = undefined
            this.historyState.eh_ck = eh_ck
            this.cutHitoryList(eh_ck)
            rawHistory.replaceState(toJS(this.historyState), '')
            if (typeof cb === 'function') {
                cb()
            }
        } else {
            if (isEditableHistoryState(ev.state)) {
                if (this.isBack(eh_ck)) {
                    this.cutHitoryList(eh_ck)
                } else {
                    for (
                        let index = this.historyState.eh_sl.length;
                        index < eh_sl.length;
                        index++
                    ) {
                        this.historyState.eh_sl.push(eh_sl[index])
                    }
                }
                this.historyState.eh_ck = eh_ck
                rawHistory.replaceState(toJS(this.historyState), '')
            } else {
                const newHistoryKey = createHistoryKey()

                this.historyState.eh_sl.splice(
                    this.indexOfActive() + 1,
                    this.historyState.eh_sl.length - this.indexOfActive() - 1
                )

                this.historyState.eh_sl.push({
                    k: newHistoryKey,
                    s: null,
                    l: this.useHash ? getHashPath() : window.location.pathname
                })

                this.historyState.eh_ck = newHistoryKey

                rawHistory.replaceState(toJS(this.historyState), '')
            }
        }
    }

    stepProcessor = (targetIndex: number, cb?: Function) => {
        targetIndex = this.indexOf(targetIndex)
        const activeIndex = this.indexOfActive()
        if (targetIndex > -1 && targetIndex < activeIndex) {
            const predictionKey = this.historyState.eh_sl[targetIndex].k
            this.predictionAction = {
                key: predictionKey,
                cb
            }
            rawHistory.go(targetIndex - activeIndex)
        } else {
            if (typeof cb === 'function') {
                cb()
            }
        }
    }

    push = (params: PushParams = {}) => {
        const { state, url, keyOrIndex = this.indexOfActive() } = params
        let targetIndex = this.indexOf(keyOrIndex)
        if (targetIndex < 0) {
            console.warn(`[push]: \`keyOrIndex\`=${keyOrIndex} is out of range'`)
            return
        }
        const historyKey = createHistoryKey()

        const absoluteUrl = getAbsolutePath(url, this.useHash, this.basename)

        this.stepProcessor(targetIndex, () => {
            this.historyState.eh_sl.splice(
                targetIndex + 1,
                this.historyState.eh_sl.length - targetIndex - 1
            )

            this.historyState.eh_sl.push({
                k: historyKey,
                s: state,
                l: this.useHash ? getHashPath(absoluteUrl) : absoluteUrl
            })
            this.historyState.eh_ck = historyKey

            rawHistory.pushState(toJS(this.historyState), '', absoluteUrl || '/')
        })
        return historyKey
    }

    replace = (params: ReplaceParams) => {
        const { state, url, keyOrIndex = this.indexOfActive() } = params
        let targetIndex = this.indexOf(keyOrIndex)
        if (targetIndex < 0 || targetIndex > this.indexOfActive()) {
            console.warn(`[replace]: \`keyOrIndex\`=${keyOrIndex} is out of range'`)
            return
        }
        const historyKey = createHistoryKey()
        const absoluteUrl = getAbsolutePath(url, this.useHash, this.basename)

        this.stepProcessor(targetIndex, () => {
            this.historyState.eh_sl.forEach((stateObject, index) => {
                if (index === targetIndex) {
                    stateObject.k = historyKey
                    stateObject.l = this.useHash ? getHashPath(absoluteUrl) : absoluteUrl
                    stateObject.s = state
                }
            })

            this.historyState.eh_ck = historyKey

            rawHistory.replaceState(toJS(this.historyState), '', absoluteUrl || '/')
        })
        return historyKey
    }

    active = (keyOrIndex: string | number, done: () => void) => {
        const targetIndex = this.indexOf(keyOrIndex)
        if (targetIndex < 0 || targetIndex > this.indexOfActive()) {
            console.warn(`[active]: \`keyOrIndex\`=${keyOrIndex} is out of range'`)
            return
        }
        this.stepProcessor(targetIndex, done)
    }

    get historyList() {
        return this.historyState
    }
}
