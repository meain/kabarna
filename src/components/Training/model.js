import * as tf from '@tensorflow/tfjs'
import { prepare, encodeString } from '../../utils/preprocessing'
import { shuffle } from '../../utils/utils'
import { saveAs } from 'file-saver'

let model
let bestModelWeights
let modelMaxLen = 0
let modelW2i = {}
let modelL2i = {}

export const predict = (input, split, start, end) => {
  const encoded = encodeString(input, modelW2i, ' ', start, end)
  console.log('encoded', encoded)

  // const result = model.predict(tf.tensor2d([5, 0, 0], [1, 3]))
  const result = model.predict(tf.tensor2d(encoded, [1, encoded.length]))
  const res = result.arraySync()
  return { res, modelL2i }
  // const res = tf.argMax(result).arraySync()[0]
  // for (let key of Object.keys(modelL2i)) {
  //   if (modelL2i[key] === res) {
  //     return key
  //   }
  // }
  // return null
}

export const save = (name = 'model', modelConfig) => {
  model.save('downloads://model')
  const data = {
    start: modelConfig.preprocessing.start,
    end: modelConfig.preprocessing.end,
    lower: modelConfig.preprocessing.lower,
    w2i: modelW2i,
    l2i: modelL2i,
    maxlen: modelMaxLen,
  }
  console.log('data:', data)
  let blob = new Blob([JSON.stringify(data)], { type: 'application/json;charset=utf-8' })
  saveAs(blob, 'config.json')
}

export const train = (input, embedding, modelConfig, callback) => {
  console.log('modelConfig', modelConfig)
  let bestAcc = 0
  console.log('input', input)
  const {
    data: [sentences, labels],
    map,
    labelMap,
    maxlen,
    embMatrix,
  } = prepare(
    input,
    embedding,
    modelConfig.preprocessing.start,
    modelConfig.preprocessing.end,
    modelConfig.preprocessing.lower,
    modelConfig.preprocessing.padding
  )
  modelMaxLen = maxlen
  modelW2i = map
  modelL2i = labelMap
  shuffle(sentences, labels)
  const mt = modelConfig.model.selectedOption.value

  // Define a model for linear regression.
  model = tf.sequential()
  const mz = mt === 'lstm' && !modelConfig.model.formInfo.lstm.bidirectional
  const em = tf.layers.embedding({
    inputDim: Object.keys(map).length,
    outputDim: modelConfig.model.formInfo[mt].edim,
    maskZero: mz,
  })
  // if (embedding) em.setWeights(embMatrix)
  model.add(em)

  if (mt === 'lstm') {
    const units = modelConfig.model.formInfo.lstm.units
    const count = modelConfig.model.formInfo.lstm.layers
    for (let i = 0; i < modelConfig.model.formInfo.lstm.layers; i++) {
      let mmmmmmmmmmm = tf.layers.lstm({
        units: units[i],
        returnSequences: i + 1 === count ? false : true,
      })
      if (modelConfig.model.formInfo.lstm.bidirectional) {
        mmmmmmmmmmm = tf.layers.bidirectional({ layer: mmmmmmmmmmm, mergeMode: 'sum' })
      }

      model.add(mmmmmmmmmmm)
    }

    model.add(
      tf.layers.dense({
        units: units[count - 1] * (modelConfig.model.formInfo.lstm.bidirectional ? 1 : 2),
        activation: 'relu',
      })
    )
  } else {
    model.add(
      tf.layers.conv1d({
        filters: modelConfig.model.formInfo.cnn.filters,
        kernelSize: modelConfig.model.formInfo.cnn.kernelSize,
        strides: modelConfig.model.formInfo.cnn.strides,
        padding: 'same',
      })
    )

    model.add(tf.layers.globalMaxPooling1d())

    model.add(
      tf.layers.dense({
        units: modelConfig.model.formInfo.cnn.filters,
        activation: 'relu',
      })
    )
  }

  model.add(tf.layers.dropout(modelConfig.model.formInfo[mt].dropout))

  const le = Object.keys(labelMap).length
  model.add(
    tf.layers.dense({
      units: le === 2 ? 1 : le,
      activation: le === 2 ? 'sigmoid' : 'softmax',
    })
  )

  // Prepare the model for training: Specify the loss and the optimizer.
  const metrics = modelConfig.params.metrics.map(m => m.value)
  model.compile({
    loss: modelConfig.params.loss.value,
    optimizer: tf.train[modelConfig.params.optimizer.value](modelConfig.params.lr),
    metrics,
  })

  if (embedding) model.layers[0].setWeights([embMatrix])
  console.log(model.summary())

  // Generate some synthetic data for training.
  const xs = tf.tensor2d(sentences, [sentences.length, sentences[0].length])
  const ys = tf.tensor1d(labels)

  // Train the model using the data.
  model
    .fit(xs, ys, {
      epochs: modelConfig.params.epochs,
      batchSize: modelConfig.params.batch,
      validationSplit: modelConfig.params.split,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (logs.val_acc > bestAcc) {
            bestAcc = logs.val_acc
            bestModelWeights = model.getWeights()
            // model.save(bestModelPath)
          }
          callback(epoch, logs)
        },
        onTrainEnd: () => {
          // model.setWeights(bestModelWeights)
        },
      },
    })
    .then(() => {
      // Use the model to do inference on a data point the model hasn't seen before:
      // Open the browser devtools to see the output
      model.setWeights(bestModelWeights)
      // const result = model.predict(tf.tensor2d([5, 0, 0], [1, 3]))
      // tf.argMax(result).print()
    })
}
