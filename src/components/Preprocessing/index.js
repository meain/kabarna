import './index.css'

import { useDropzone } from 'react-dropzone'
import React, { useState, useCallback } from 'react'

const Preprocessing = () => {
  const [state, setState] = useState({
    customPadding: false,
    padding: 0,
    start: false,
    end: false,
    lower: false,
  })

  const onChange = event => {
    const inputs = [...event.currentTarget.elements]
    const ns = { ...state }
    ns.customPadding = inputs[0].checked
    ns.padding = parseInt(inputs[1].value)
    ns.start = inputs[2].checked
    ns.end = inputs[3].checked
    ns.lower = inputs[4].checked
    setState(ns)
  }
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div className="Preprocessing center f1 wh vert">
      <div className="Input pad w flex">
        <div {...getRootProps()} className="DropTarget f1 flex center">
          <input {...getInputProps()} className="tc" />
          {isDragActive ? (
            <p className="tc">Drop the files here ...</p>
          ) : (
            <p className="tc">Drop your data file here</p>
          )}
        </div>
        <div {...getRootProps()} className="DropTarget f1 flex center">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="tc">Drop the files here ...</p>
          ) : (
            <p className="tc">Drop custom embeddings</p>
          )}
        </div>
      </div>
      <div className="f1 pad w">
        <form className="flex vert" onChange={onChange}>
          <div>
            <label>
              <input type="checkbox" />
              Custom padding
            </label>{' '}
            <label className={state.customPadding ? '' : 'hide'}>
              | Pad length <input type="number" />
            </label>
          </div>

          <label>
            <input type="checkbox" />
            Start token
          </label>

          <label>
            <input type="checkbox" />
            End token
          </label>

          <label>
            <input type="checkbox" />
            Lower input
          </label>
        </form>
      </div>
    </div>
  )
}

export default Preprocessing
