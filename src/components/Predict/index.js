import React, { useState } from 'react'
import { predict } from '../Training/model'
import './index.css'

const Predict = ({ whole }) => {
  const [prediction, setPrediction] = useState(null)
  const oc = e => {
    const input = e.target.value
    const res = predict(input, whole.preprocessing.start, whole.preprocessing.end)
    setPrediction(res)
  }


  const getKV = (res, modelL2i) => {
    console.log("res, modelL2i", res, modelL2i)
    let w = []
    Object.keys(modelL2i).forEach((k) => {
      const s = {key: k, value: res[0][modelL2i[k]]}
      w.push(s)
    })
    console.log("w", w)
    return w
  }

  // const getKey = (res, modelL2i) => {
  //   for (let key of Object.keys(modelL2i)) {
  //     if (modelL2i[key] === res) {
  //       return key
  //     }
  //   }
  //   return null
  // }

  return (
    <div className="Predict flex center wh vert">
      <input onChange={oc} type="string" placeholder="Type to predict" />
      {prediction && (
        <div className="flex vert">
          {getKV(prediction.res, prediction.modelL2i).map((p, i) => {
            return (
              <div>
                {p.key}: {Math.round(p.value*100)}%
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Predict
