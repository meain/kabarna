import * as tf from '@tensorflow/tfjs'
import _ from 'lodash'

import {
  IndexMapType,
  InputType,
  getAllSentences,
  getIndexMap,
  getMaxLen,
  listToIndexMap,
} from './utils'

function tokenize(input, split = ' ') {
  return input.split(split)
}

function padding(sentences, value, maxlen, padding) {
  if (!maxlen) maxlen = getMaxLen(sentences)
  if (padding === 'pre')
    return {
      sentences: sentences.map(s => [..._.fill(Array(maxlen - s.length), value), ...s]),
      maxlen,
    }
  return {
    sentences: sentences.map(s => [...s, ..._.fill(Array(maxlen - s.length), value)]),
    maxlen,
  }
}

export function encodeString(sentence, w2i, split, start, end) {
  let encoded = tokenize(sentence, split).map(word => w2i[word])
  if (start) encoded = [w2i['<start>'], ...encoded]
  if (end) encoded = [...encoded, w2i['<end>']]
  return encoded
}

export function getEmbMatrix(embedding, start, end) {
  const dim = embedding.split('\n')[0].split(' ').length - 1
  let h = embedding.split('\n').length + 2
  let excess = 0
  if (start) excess += 1
  if (end) excess += 1

  const embMat = tf.randomNormal([h + excess, dim], 0.1, 0.1, 'float32')

  embMat[0] = tf.zeros([1, dim])
  embMat[1] = tf.ones([1, dim])
  // const embMat = [tf.zeros([1, dim]), tf.ones([1, dim])]
  // if (start) embMat.push(tf.mul(tf.ones([1, dim]), 2))
  // if (end) embMat.push(tf.mul(tf.ones([1, dim]), 3))
  //
  if (start) embMat[2] = tf.mul(tf.ones([1, dim]), 2)
  if (end) embMat[3] = tf.mul(tf.ones([1, dim]), 3)

  embedding.split('\n').forEach((wordvec, i) => {
    const ws = wordvec.split(' ')
    embMat[excess + i + 2] = ws.splice(1, ws.length).map(v => parseFloat(v))
    // embMat.push(ws.splice(1, ws.length).map(v => parseFloat(v)))
  })
  return embMat
  // return tf.tensor2d(embMat, [embMat.length, dim], 'float32')
  // return tf.tensor2d(embMat)
}

export function prepare(
  input,
  embedding = null,
  start = true,
  end = true,
  lower = true,
  maxlen = null,
  split = ' '
) {
  let allSentences = getAllSentences(input)
  const map = getIndexMap(allSentences, start, end, lower, embedding)
  const labelMap = listToIndexMap(Object.keys(input))

  let sentences = []
  let labels = []
  Object.keys(input).map(key => {
    input[key].map(sentence => {
      if (lower) sentence = sentence.toLowerCase()
      sentences.push(encodeString(sentence, map, split, start, end))
      labels.push(labelMap[key])
    })
  })
  const { sentences: ps, maxlen: cml } = padding(sentences, map['<pad>'], maxlen)
  return {
    data: [ps, labels],
    map,
    labelMap,
    maxlen: cml,
    embMatrix: getEmbMatrix(embedding, start, end),
  }
}
