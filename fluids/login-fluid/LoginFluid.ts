import LoginScreen from './LoginScreen'

const VerifyMsgFluid = class name {
    constructor(parameters) {}
}

// const verifyMsgFluidDelegate = this.startFlow(VerifyMsgFluid, {})
// verifyMsgFluidDelegate.on('done', res => {
//     if (res.pass) {
//     }
// })

const ProductDetail = null
const fluidPath = (s: string) => (x: any) => {}
const OrderPage = undefined
const PayPage = null
const PaySuccessPage = null
const PayFailPage = null

@fluidPath('/login-fluid/:productCode')
export default class LoginFluid extends FluidRoute {
    orderInfo: any
    routerParams: any
    onStartFlow() {
        if (!checkIfLogin()) {
            const fluidScreenDelegate = this.pushScreen(LoginScreen, { username: 'test1' })
            fluidScreenDelegate.on('loginResult', res => {
                if (res.loginSuccess) {
                    this.showProductDetail()
                }
            })
        } else {
            this.showProductDetail()
        }
    }
    showProductDetail = () => {
        const delegate = this.pushScreen(ProductDetail, {
            productCode: this.routerParams.productCode
        })
        delegate.on('clickNextPage', () => {
            this.showOrderPage()
        })
    }
    showOrderPage = () => {
        const orderDelegate = this.pushScreen(OrderPage)
        orderDelegate.on('finishInputInfo', orderInfo => {
            this.showPayPage(orderInfo)
        })
    }
    showPayPage = orderInfo => {
        const payDelegate = this.pushScreen(PayPage, orderInfo)
        payDelegate.on('payResult', payResult => {
            if (payResult.success) {
                this.replaceScreen(PaySuccessPage)
            } else {
                this.replaceScreen(PayFailPage)
            }
        })
    }
}
