import React, { useState } from 'react'
import { predict } from '../Training/model'

const Predict = ({ whole }) => {
  const [prediction, setPrediction] = useState('')
  const oc = e => {
    const input = e.target.value
    const res = predict(input, whole.preprocessing.start, whole.preprocessing.end)
    setPrediction(res)
  }

  return (
    <div>
      <input onChange={oc} type="string" />

      <div>{prediction}</div>
    </div>
  )
}

export default Predict
