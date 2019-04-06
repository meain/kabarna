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

  // console.log('state.embedding:', state.embedding)
  // console.log('state.input:', state.input)

  return (
    <div className="Preprocessing center f1 wh vert">
      <div className="Input pad w flex fsb">
        <div className="flex center vert w4">
          <Dropzone onDrop={acceptedFiles => onDrop('input', acceptedFiles)}>
            {({ getRootProps, getInputProps }) => (
              <section className="DropTarget w f1 flex center pad">
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p className="tc pad">
                    {state.input === undefined
                      ? 'Drag and drop, or click to select file'
                      : 'OK, loaded'}
                  </p>
                </div>
              </section>
            )}
          </Dropzone>{' '}
          <div>Data file (json)</div>
        </div>

        <div className="flex center vert w4">
          <Dropzone onDrop={acceptedFiles => onDrop('embedding', acceptedFiles)}>
            {({ getRootProps, getInputProps }) => (
              <section className="DropTarget w f1 flex center pad">
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p className="tc pad">
                    {state.embedding === undefined
                      ? 'Drag and drop, or click to select file'
                      : 'OK, loaded'}
                  </p>
                </div>
              </section>
            )}
          </Dropzone>
          <div>Embedding file (text)</div>
        </div>
      </div>
      <div className="f1 pad w flex">
        <form className="flex vert pad2 br f1" onChange={onChange}>
          <h3>OPTIONS</h3>
          <label>
            <input type="checkbox" checked={state.customPadding} />
            <div>Custom padding</div>
          </label>
          <label className={state.customPadding ? '' : 'hide'}>
            <div>Pad length:</div>
            <input type="number" value={state.padding} />
          </label>

          <label>
            <input type="checkbox" checked={state.start} />
            <div>Start token</div>
          </label>

          <label>
            <input type="checkbox" checked={state.end} />
            <div>End token</div>
          </label>

          <label>
            <input type="checkbox" checked={state.lower} />
            <div>Lower input</div>
          </label>
        </form>
        <div className="f1 pad scroll">
          <h3>INPUT</h3>
          <pre>{JSON.stringify(state.input || {}, undefined, 2)}</pre>
        </div>
      </div>
    </div>
  )
}

export default Preprocessing
