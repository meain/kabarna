import * as tf from '@tensorflow/tfjs'
import { prepare } from '../../utils/preprocessing'

export const train = () => {
  const input = {
    hai: ['hello there you', 'how are you', 'yo you there'],
    bye: ['tata', 'see you', 'RIP', 'bye'],
  }

  // const { w2i, classW2i } = utils.preprocess(input)
  const {
    data: [sentences, labels],
    map,
    labelMap,
  } = prepare(input)

  // Define a model for linear regression.
  const model = tf.sequential()
  model.add(
    tf.layers.embedding({
      inputDim: Object.keys(map).length,
      outputDim: 20,
      maskZero: true,
    })
  )
  model.add(tf.layers.lstm({ units: 20, returnSequences: false }))
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }))

  // Prepare the model for training: Specify the loss and the optimizer.
  model.compile({ loss: 'binaryCrossentropy', optimizer: 'sgd' })

  // Generate some synthetic data for training.
  const xs = tf.tensor2d(sentences, [sentences.length, sentences[0].length])
  const ys = tf.tensor1d(labels)

  // Train the model using the data.
  model
    .fit(xs, ys, {
      epochs: 10,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(' epoch, logs ', epoch, logs)
        },
      },
    })
    .then(() => {
      // Use the model to do inference on a data point the model hasn't seen before:
      // Open the browser devtools to see the output
      const result = model.predict(tf.tensor2d([5, 0, 0], [1, 3]))
      tf.argMax(result).print()
    })
}
