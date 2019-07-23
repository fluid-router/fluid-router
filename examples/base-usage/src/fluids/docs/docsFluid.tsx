import React from 'react'
import SlideScreen from './screens/SlideScreen'

export default (navigation: any, params: any) => {
    const displayPage = (pageNumber: number) => {
        navigation.pushScreen(
            <SlideScreen
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
