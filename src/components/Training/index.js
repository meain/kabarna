import React, { useState } from 'react'

import { train } from './model'

const Training = () => {
  train()
  return (
    <div className="Training">
      <div className="Accuracy">
        <div>
          <div>1%</div>
          <div>Test accuracy</div>
          <div>graph</div>
        </div>
        <div>
          <div>2%</div>
          <div>Train accuracy</div>
          <div>graph</div>
        </div>
      </div>

      <div className="Controlls">
        <div className="Play">Train</div>
      </div>
    </div>
  )
}

export default Training
