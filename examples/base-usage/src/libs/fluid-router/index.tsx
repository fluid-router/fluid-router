import React, { Component } from 'react'
import { createEditableHistory } from '../editable-history'
import { observer } from 'mobx-react'
import { reaction } from 'mobx'
import { Transition, animated } from 'react-spring/renderprops'

type FluidRouterProps = {
    useHash?: boolean
    routes: any[]
}

@observer
export default class FluidRouter extends Component<FluidRouterProps> {
    static defaultProps = {
        useHash: false
    }
    initPage = true
    editableHistory = createEditableHistory({ useHash: this.props.useHash })
    navigation = {
        pushScreen: (Comp: any) => {
            let key: string
            if (this.editableHistory.historyList.eh_sl.length === 1 && this.initPage) {
                this.initPage = false
                key = this.editableHistory.replace({ url: '/docs' }) || ''
            } else {
                key = this.editableHistory.push({ url: '/docs' }) || ''
            }

            const AnimatedComp = (styles: any) => (
                <animated.div
                    key={key}
                    style={{
                        ...styles,
                        position: 'absolute',
                        width: '100%'
                    }}
                >
                    {Comp}
                </animated.div>
            )

            this.setState({
                [`${key}`]: AnimatedComp
            })
        }
    }
    state: any = {
        isPush: true
    }
    lastKey?:string
    lastLength: number = 0
    componentDidMount() {
        reaction(
            () => this.editableHistory.historyList.eh_sl.length,
            length => {
                this.setState({
                    isPush: length > this.lastLength
                })
                this.lastLength = length
            }
        )
        reaction(
            () => this.editableHistory.historyList.eh_ck,
            eh_ck => {
                if (this.lastKey && !this.state[eh_ck]) {
                    this.setState({
                        [eh_ck]: this.state[this.lastKey]
                    })
                }
               this.lastKey = eh_ck
            }
        )
        const { routes } = this.props
        this.editableHistory.active(0, () => {
            // test
            const docsFluid = routes[0]['/docs']
            docsFluid(this.navigation)
        })
    }
    render() {
        return (
            <>
                {this.editableHistory.historyList.eh_sl.length > 0 ? (
                    <>
                        {this.state.isPush ? (
                            <Transition
                                native
                                reset
                                unique
                                items={this.editableHistory.historyList.eh_ck}
                                from={{ opacity: 1, transform: 'translate3d(100%,0,0)' }}
                                enter={{ opacity: 1, transform: 'translate3d(0%,0,0)' }}
                                leave={{ opacity: 0, transform: 'translate3d(-50%,0,0)' }}
                            >
                                {eh_ck => {
                                    return this.state[eh_ck]
                                }}
                            </Transition>
                        ) : (
                            <Transition
                                native
                                reset
                                unique
                                items={this.editableHistory.historyList.eh_ck}
                                from={{ opacity: 1, transform: 'translate3d(-100%,0,0)' }}
                                enter={{ opacity: 1, transform: 'translate3d(0%,0,0)' }}
                                leave={{ opacity: 0, transform: 'translate3d(50%,0,0)' }}
                            >
                                {eh_ck => {
                                    return this.state[eh_ck]
                                }}
                            </Transition>
                        )}
                    </>
                ) : null}
            </>
        )
    }
}
