import React from 'react'

type PPTPageProps = {
    pageNumber: number
    onNext: () => void
    onBack: () => void
}

export default (props: PPTPageProps) => {
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
                    <div className="App-link" onClick={props.onNext}>
                        next
                    </div>
                </div>
            </header>
        </div>
    )
}
