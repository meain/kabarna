import './App.css'

import { Router, Link } from '@reach/router'
import React, { Component } from 'react'

import ModelSelection from './components/ModelSelection'
import Predict from './components/Predict'
import Preprocessing from './components/Preprocessing'
import Training from './components/Training'

class App extends Component {
  constructor(props: Props) {
    super(props)

    this.state = {
      currentPath: 'preprocessing',
      paths: ['preprocessing', 'modelselection', 'training'],
      preprocessing: {
        customPadding: false,
        padding: 0,
        start: false,
        end: false,
        lower: true,
        input: undefined,
      },
      modelselection: {
        selectedOption: { value: 'lstm', label: 'LSTM' },
        formInfo: { lstm: {
            edim: 50,
            layers: 1,
            units: [100],
            dropout: 0.25,
            bidirectional: true,
          },
          cnn: {
            edim: 50,
            filters: 10,
            kernelSize: 5,
            strides: 1,
            dropout: 0.25,
          },
        },
      },
      training: {
        epochs: 10,
        split: 0.1,
        batch: 32,
        lr: 0.001,
        optimizer: null,
        loss: null,
        metrics: null,
      },
    }
  }

  ss(key, value) {
    this.setState(state => {
      let ns = { ...this.state }
      ns[key] = value
      return ns
    })
  }

  render() {
    return (
      <div className="App flex vert">
        <div className="Header shadow">MAKKA KABARNA</div>

        <div className="Footer flex center fsb pad shadow">
          <button className="btn">
            <Link to="/" exact>Preprocessing</Link>
          </button>
          <button className="btn">
            <Link to="modelselection">Model Selection</Link>
          </button>
          <button className="btn">
            <Link to="training">Training</Link>
          </button>
          <button className="btn">
            <Link to="predict">Predict</Link>
          </button>
        </div>

        <Router className="f1">
          <Preprocessing
            path="/"
            whole={this.state}
            {...this.state.preprocessing}
            setState={value => {
              this.ss('preprocessing', value)
            }}
          />
          <ModelSelection
            path="/modelselection"
            whole={this.state}
            {...this.state.modelselection}
            setState={value => {
              this.ss('modelselection', value)
            }}
          />
          <Training
            path="/training"
            whole={this.state}
            {...this.state.training}
            setState={value => {
              this.ss('training', value)
            }}
          />
          <Predict path="/predict" whole={this.state} />
        </Router>
      </div>
    )
  }
}

export default App
