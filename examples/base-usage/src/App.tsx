import React from 'react'
import './App.css'
import FluidRouter from './libs/fluid-router'
import routes from './fluids/route'

const App: React.FC = () => {
    return <FluidRouter useHash={true} routes={[routes]} />
}

export default App
