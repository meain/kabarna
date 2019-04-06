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
          Train
        </button>
        <button className="Play" onClick={() => save('model', modelConfig)}>
          Download
        </button>
      </div>

      <form className="flex vert pad" onChange={onChange}>
        <label className="pad">
          Epochs <input type="number" />
        </label>
        <label className="pad">
          Validation Split <input type="number" />
        </label>
        <label className="pad">
          Learning rate
          <input type="number" />
        </label>
        <label className="pad">
          Batch size
          <input type="number" />
        </label>
        <Select
          className="pad"
          style={{ width: 400 }}
          value={state.optimizer}
          onChange={onOptimizerChange}
          options={optimizers}
        />
        <Select
          className="pad"
          style={{ width: 400 }}
          value={state.loss}
          onChange={onLossChange}
          options={lossess}
        />
        <Select
          className="pad"
          isMulti
          style={{ width: 400 }}
          value={state.metrics}
          onChange={onMetricsChange}
          options={metrics}
        />
      </form>
    </div>
  )
}

export default Training
