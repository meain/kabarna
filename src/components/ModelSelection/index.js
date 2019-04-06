import React, { Component, useState } from 'react'
import Select from 'react-select'
import Form from 'react-jsonschema-form'

import './index.css'

const ModelSelection = ({ whole, setState, ...state }) => {
  const options = [
    {
      value: 'lstm',
      label: 'Long Short Term Memory',
    },
    {
      value: 'cnn',
      label: 'Convolutional Neural Network',
    },
  ]

  const info = {
    lstm: {
      img: 'https://cdn-images-1.medium.com/max/1600/1*27JmK8VBdphpSCWNb4MhNA.png',
      desc:
        'Sequence Classification Using Deep Learning. ... To train a deep neural network to classify sequence data, you can use an LSTM network. An LSTM network enables you to input sequence data into a network, and make predictions based on the individual time steps of the sequence data.',
    },
    cnn: {
      img: 'https://datawarrior.files.wordpress.com/2016/10/cnn.png',
      desc:
        'CNNs use a variation of multilayer perceptrons designed to require minimal preprocessing.They are also known as shift invariant or space invariant artificial neural networks (SIANN), based on their shared-weights architecture and translation invariance characteristics. Convolutional networks were inspired by biological processes[4][5][6][7] in that the connectivity pattern between neurons resembles the organization of the animal visual cortex',
    },
  }

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

  console.log(info[state.selectedOption.value].img)
  return (
    <div className="ModelSelection flex f1 h vert">
      <div className="bb w pad flex vert">
        <Select value={state.selectedOption} onChange={onModelSelection} options={options} />
        {state.selectedOption !== undefined && (
          <div className="flex fsb center pad">
            <img src={info[state.selectedOption.value].img} alt="image" className="img" />
            <p className="pad2">{info[state.selectedOption.value].desc}</p>
          </div>
        )}
      </div>
      <div className="pad">
        {state.selectedOption ? (
          <React.Fragment>
            {state.selectedOption.value === 'lstm' ? (
              <form onChange={e => formChange('lstm', e)} className="flex vert">
                <label>
                  <div>Embedding dimension:</div>
                  <input type="number" />
                </label>
                <label>
                  <div>Layers:</div>
                  <input type="number" />
                </label>
                <label>
                  <div>Units:</div>
                  <input type="string" />
                </label>
                <label>
                  <div>Dropout:</div>
                  <input type="number" />
                </label>
                <label>
                  <input type="checkbox" />
                  <div>Bidirectional</div>
                </label>
              </form>
            ) : (
              <form onChange={e => formChange('cnn', e)} className="flex vert">
                <label>
                  <div>Embedding dimension:</div>
                  <input type="number" />
                </label>
                <label>
                  <div>Filters:</div>
                  <input type="number" />
                </label>
                <label>
                  <div>Kernel size:</div>
                  <input type="number" />
                </label>
                <label>
                  <div>Strides:</div>
                  <input type="number" />
                </label>
                <label>
                  <div>Dropout:</div>
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
