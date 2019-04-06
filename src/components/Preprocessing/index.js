import './index.css'

import React from 'react'
import Dropzone from 'react-dropzone'

const Preprocessing = ({ whole, setState, ...state }) => {
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

  const onDrop = (type, acceptedFiles) => {
    const reader = new FileReader()

    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    reader.onload = () => {
      // Do whatever you want with the file contents
      const binaryStr = reader.result
      let input = binaryStr
      if (type === 'input') {
        input = JSON.parse(binaryStr)
      } else {
        if (binaryStr[binaryStr.length - 1] === '\n') {
          input = binaryStr.substring(0, binaryStr.length - 1)
        }
      }
      const ns = { ...state }
      ns[type] = input
      setState(ns)
    }

    acceptedFiles.forEach(file => reader.readAsBinaryString(file))
  }

  return (
    <div className="Preprocessing center f1 wh vert">
      <div className="Input pad w flex">
        <Dropzone onDrop={acceptedFiles => onDrop('input', acceptedFiles)}>
          {({ getRootProps, getInputProps }) => (
            <section className="DropTarget f1 flex center">
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p className="tc">Drag 'n' drop some files here, or click to select files</p>
              </div>
            </section>
          )}
        </Dropzone>

        <Dropzone onDrop={acceptedFiles => onDrop('embedding', acceptedFiles)}>
          {({ getRootProps, getInputProps }) => (
            <section className="DropTarget f1 flex center">
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p className="tc">Drag 'n' drop some files here, or click to select files</p>
              </div>
            </section>
          )}
        </Dropzone>
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
