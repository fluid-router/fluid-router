import React from 'react'

type SlideScreenProps = {
    pageNumber: number
    onNext: (nextPageNumber: number) => void
    onBack: () => void
}

export default (props: SlideScreenProps) => {
    return (
        <div className="App">
            <header className="App-header">
                <p>{'Page ' + props.pageNumber}</p>
                <div style={{ display: 'flex' }}>
                    {props.pageNumber === 1 ? null : (
                        <div className="App-link" onClick={props.onBack}>
                            prev
                        </div>
                    )}

                    <div
                        className="App-link"
                        onClick={() => {
                            props.onNext(props.pageNumber + 1)
                        }}
                    >
                        next
                    </div>
                </div>
            </header>
        </div>
    )
}
