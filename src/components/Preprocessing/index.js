import './index.css'

import React, { Component, useState } from 'react'

const Preprocessing = () => {
  const [state, setState] = useState({})

  const onChange = (event) => {
    console.log("event", event)
  }

  return (
    <div className="Preprocessing center f1 wh vert">
      <div className="Input f1 pad w">Text input</div>
      <div className="f1 pad w">
        <form className="flex vert" onChange={onChange}>
          <div>
            <label>
              <input type="checkbox" />
              Custom padding
            </label>{' '}
            <label>
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
