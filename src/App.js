import './App.css'

import { Router } from '@reach/router'
import React, { Component } from 'react'

import ModelSelection from './components/ModelSelection';
import Preprocessing from './components/Preprocessing'
import Training from './components/Training'

class App extends Component {
  render() {
    return (
      <div className="App flex vert">
        <div className="Header shadow">MAKKA KABARNA</div>
        <Router className="f1">
          <Preprocessing path="/preprocessing" />
          <ModelSelection path="/modelselection" />
          <Training path="/training" />
        </Router>
        <div className="Footer flex center fsb pad shadow">
          <button className="btn">PREV</button>
          <div className="caps">Preprocessing</div>
          <button className="btn">NEXT</button>
        </div>
      </div>
    )
  }
}

export default App
