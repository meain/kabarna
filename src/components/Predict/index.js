import React, { useState } from 'react'
import { predict } from '../Training/model'
import './index.css'

const Predict = ({ whole }) => {
  const [prediction, setPrediction] = useState('')
  const oc = e => {
    const input = e.target.value
    const res = predict(input, whole.preprocessing.start, whole.preprocessing.end)
    setPrediction(res)
  }

  return (
    <div className="Predict flex center wh vert">
      <input onChange={oc} type="string" placeholder="Type to predict" />
      {prediction && <div>Prediction: {prediction}</div>}
    </div>
  )
}

export default Predict
