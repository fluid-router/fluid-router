import React from 'react'
import PPTPage from './screens/PPTPage'

export default (navigation: any) => {
    const displayPage = (pageNumber: number) => {
        navigation.pushScreen(
            <PPTPage
                pageNumber={pageNumber}
                onNext={() => {
                    displayPage(pageNumber + 1)
                }}
                onBack={() => {
                    window.history.go(-1)
                }}
            />
        )
    }
    displayPage(1)
}
