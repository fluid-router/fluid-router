function inject(params: any) {}

class LoginFailScreen extends Screen {}
class LoginSuccessScreen extends Screen {}

const userInfo = { authLogin: true  , username: 'login fluid' }

class LoginScreen extends Screen {
    onFocus: (direction: Direction) => void
    onBlur: (direction: Direction) => void
    active: boolean
}

class LoginFluid extends Fluid {
    onStartFlow() {
        if (userInfo.authLogin) {
            this.endFlow({
                loginSuccess: true
            })
        } else {
            this.pushScreen(LoginScreen, {
                props: {
                    username: userInfo.username,
                    onFinish: loginInfo => {
                        if (loginInfo.res === 'success') {
                            this.replaceScreen(LoginFailScreen)
                        } else {
                            this.pushScreen(LoginSuccessScreen)
                            setTimeout(() => {
                                this.endFlow({
                                    loginSuccess: true
                                })
                            }, 3000)
                        }
                    }
                }
            })
        }
    }
    isDestory = false
    onBackflow(screens: Screen[]) {}
    onInflow(screens: Screen[]) {}
    onDestory() {}
}
