import React, { Component, useState } from 'react'
import Select from 'react-select'
import Form from 'react-jsonschema-form'

import './index.css'

const ModelSelection = ({ whole, setState, ...state }) => {
  const options = [
    {
      value: 'lstm',
      label: 'LSTM',
    },
    {
      value: 'cnn',
      label: 'CNN',
    },
  ]

  const onModelSelection = opt => {
    setState({ ...state, selectedOption: opt })
  }

  const formChange = (type, event) => {
    const inputs = [...event.currentTarget.elements]
    const fi = state.formInfo !== null ? { ...state.formInfo } : {}
    let data = {}
    if (type === 'lstm') {
      data.edim = parseInt(inputs[0].value)
      data.layers = parseInt(inputs[1].value)
      data.units = inputs[2].value.split(',').map(v => parseInt(v))
      data.dropout = parseFloat(inputs[3].value)
      data.bidirectional = inputs[4].checked
    } else {
      data.edim = parseInt(inputs[0].value)
      data.filters = parseInt(inputs[1].value)
      data.kernelSize = parseInt(inputs[2].value)
      data.strides = parseInt(inputs[3].value)
      data.dropout = parseFloat(inputs[4].value)
    }
    fi[type] = data
    setState({ ...state, formInfo: fi })
  }

  return (
    <div className="ModelSelection flex f1 h">
      <div className="Selection br h pad flex vert">
        <Select value={state.selectedOption} onChange={onModelSelection} options={options} />
        MODEL DIAGRAM??
      </div>
      <div className="pad">
        {state.selectedOption ? (
          <React.Fragment>
            {state.selectedOption.value === 'lstm' ? (
              <form onChange={e => formChange('lstm', e)} className="flex vert">
                <label>
                  Embedding dimension
                  <input type="number" />
                </label>
                <label>
                  Layers
                  <input type="number" />
                </label>
                <label>
                  Units
                  <input type="string" />
                </label>
                <label>
                  Dropout
                  <input type="number" />
                </label>
                <label>
                  <input type="checkbox" />
                  Bidirectional
                </label>
              </form>
            ) : (
              <form onChange={e => formChange('cnn', e)} className="flex vert">
                <label>
                  Embedding dimension
                  <input type="number" />
                </label>
                <label>
                  Filters
                  <input type="number" />
                </label>
                <label>
                  Kernel size
                  <input type="number" />
                </label>
                <label>
                  Strides
                  <input type="number" />
                </label>
                <label>
                  Dropout
                  <input type="number" />
                </label>
              </form>
            )}
          </React.Fragment>
        ) : (
          <div>Choose a model type</div>
        )}
      </div>
    </div>
  )
}

export default ModelSelection
