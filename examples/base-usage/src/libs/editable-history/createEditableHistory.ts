import { HistoryEditor } from './HistoryEditor'

type createEditableHistoryProps = {
    basename?: string
    useHash?: boolean
}

// let hasCreated = false

export default function createEditableHistory(props: createEditableHistoryProps = {}) {
    const { basename = '', useHash = false } = props

    // if (hasCreated) {
    //     console.warn('A window supports only one editableHistory at a time')
    //     return
    // }
    // hasCreated = true

    const historyEditor = new HistoryEditor({
        basename,
        useHash
    })

    return {
        push: historyEditor.push,
        replace: historyEditor.replace,
        active: historyEditor.active,
        historyList: historyEditor.historyList,
        length: historyEditor.historyList.eh_sl.length
    }
}
