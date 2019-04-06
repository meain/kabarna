import './index.css'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import React, { useState } from 'react'
import Select from 'react-select'

import { train, save } from './model'
import run from './run.svg'
import download from './download.svg'

const Training = ({ whole, setState, ...state }) => {
  const [trainStats, setTrainStats] = useState([])
  const modelConfig = {
    preprocessing: whole.preprocessing,
    model: whole.modelselection,
    params: state,
  }
  const trainModel = () => {
    setTrainStats([])
    const callback = (epoch, logs) => {
      console.log('logs:', logs)
      setTrainStats(ts => {
        let nts = [...ts]
        nts.push({ epoch, ...logs })
        return nts
      })
    }

    const input = whole.preprocessing.input
    const embedding = whole.preprocessing.embedding || null
    // const input = {
    //   hai: ['hello there you', 'how are you', 'yo you there'],
    //   bye: ['tata', 'see you', 'RIP', 'bye'],
    //   wokay: ['ok', 'wokay', 'yooooooooooooooooooooooooooooooooooooooooooooooo '],
    // }
    train(input, embedding, modelConfig, callback)
  }
  console.log('state:', state)

  const optimizers = [
    { value: 'sgd', label: 'Stocastic Gradient Descent' },
    { value: 'adam', label: 'Adam' },
  ]

  const lossess = [
    { value: 'binaryCrossentropy', label: 'Binary Cross Entropy' },
    { value: 'sparseCategoricalCrossentropy', label: 'Categorical Cross Entropy' },
  ]
  const metrics = [{ value: 'accuracy', label: 'Accuracy' }]

  const onOptimizerChange = opt => {
    setState({ ...state, optimizer: opt })
  }
  const onLossChange = opt => {
    setState({ ...state, loss: opt })
  }
  const onMetricsChange = opt => {
    setState({ ...state, metrics: opt })
  }

  const onChange = event => {
    const inputs = [...event.currentTarget.elements]
    let ns = { ...state }
    ns.epochs = parseInt(inputs[0].value)
    ns.split = parseFloat(inputs[1].value)
    ns.lr = parseFloat(inputs[2].value)
    ns.batch = parseFloat(inputs[3].value)
    setState(ns)
  }

  return (
    <div className="Training">
      <div className="Graphs flex center w">
        <div className="Accuracy flex center vert f1">
          <div className="Percentage">
            {Math.round((trainStats.length > 0 ? trainStats[trainStats.length - 1].acc : 0) * 100)}%
          </div>
          <div>Train accuracy</div>
          <ResponsiveContainer width="90%" height={400}>
            <LineChart data={trainStats}>
              <Line isAnimationActive={false} type="monotone" dataKey="acc" stroke="#8884d8" />
              <Line isAnimationActive={false} type="monotone" dataKey="loss" stroke="hotpink" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="epoch" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="Accuracy flex center vert f1">
          <div className="Percentage">
            {Math.round(
              (trainStats.length > 0 ? trainStats[trainStats.length - 1].val_acc : 0) * 100
            )}
            %
          </div>
          <div>Test accuracy</div>
          <ResponsiveContainer width="90%" height={400}>
            <LineChart data={trainStats}>
              <Line isAnimationActive={false} type="monotone" dataKey="val_acc" stroke="#8884d8" />
              <Line isAnimationActive={false} type="monotone" dataKey="val_loss" stroke="hotpink" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="epoch" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="Controlls flex center sb">
        <button className="Play" onClick={trainModel}>
          <img src={run} />
          Train
        </button>
        <button className="Play" onClick={() => save('model', modelConfig)}>
          <img src={download} />
          Download
        </button>
      </div>

      <form className="flex scroll pad fsb" onChange={onChange}>
        <div className="flex vert">
          <h3>Training Configuration</h3>
          <label className="pad">
            <div>Epochs:</div>
            <input type="number" value={state.epochs} />
          </label>
          <label className="pad">
            <div>Validation Split:</div>
            <input type="number" value={state.split} />
          </label>
          <label className="pad">
            <div>Learning rate:</div>
            <input type="number" value={state.lr} />
          </label>
          <label className="pad">
            <div>Batch size:</div>
            <input type="number" value={state.batch} />
          </label>
        </div>
        <div className="flex vert">
          <h3>Model Configuration</h3>
          <label>
            <div>Optimizer:</div>
            <Select
              className="Sel"
              value={state.optimizer}
              onChange={onOptimizerChange}
              options={optimizers}
            />
          </label>
          <label>
            <div>Loss:</div>
            <Select className="Sel" value={state.loss} onChange={onLossChange} options={lossess} />
          </label>
          <label>
            <div>Metrics:</div>
            <Select
              className="Sel"
              isMulti
              value={state.metrics}
              onChange={onMetricsChange}
              options={metrics}
            />
          </label>
        </div>
      </form>
    </div>
  )
}

export default Training
