import React, { Component, useState } from 'react'
import Select from 'react-select'
import Form from 'react-jsonschema-form'

import './index.css'

const ModelSelection = () => {
  const options = [
    {
      value: {
        schema: {
          title: 'LSTM Configuration',
          type: 'object',
          required: [],
          properties: {
            layers: { type: 'number', title: 'Layers', default: '' },
            bidirectional: { type: 'boolean', title: 'Bidirectional?', default: false },
            units: { type: 'number', title: 'Units', default: '' },
          },
        },
      },
      label: 'LSTM',
    },
    {
      value: {
        schema: {
          title: 'CNN Configuration',
          type: 'object',
          required: [],
          properties: {
            units: { type: 'number', title: 'Units', default: '' },
          },
        },
      },
      label: 'CNN',
    },
  ]

  const [state, setState] = useState({
    selectedOption: null,
    formInfo: null,
  })

  const onModelSelection = opt => {
    setState({ ...state, selectedOption: opt })
  }

  const onFormChange = data => {
      //only take on change
    // setState(state => {
    //   return { ...state, formInfo: data.formData }
    // })
  }

  return (
    <div className="ModelSelection flex f1 h">
      <div className="Selection br h pad flex vert">
        <Select value={state.selectedOption} onChange={onModelSelection} options={options} />
        MODEL DIAGRAM??
      </div>
      <div className="pad">
        <Form
          className="ModelSelectionForm"
          schema={state.selectedOption !== null ? state.selectedOption.value.schema : {}}
          onChange={onFormChange}
        />
      </div>
    </div>
  )
}

export default ModelSelection
