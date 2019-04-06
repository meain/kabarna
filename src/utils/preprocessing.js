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
  if (padding === 'post')
    return sentences.map(s => [...s, ..._.fill(Array(maxlen - s.length), value)])
  return sentences.map(s => [..._.fill(Array(maxlen - s.length), value), ...s])
}

export function encodeString(sentence, w2i, split, start, end) {
  let encoded = tokenize(sentence, split).map(word => w2i[word])
  if (start) encoded = [w2i['<start>'], ...encoded]
  if (end) encoded = [...encoded, w2i['<end>']]
  return encoded
}

export function prepare(input, start = true, end = true, lower = true, split = ' ', pretrained) {
  let allSentences = getAllSentences(input)
  const map = getIndexMap(allSentences, start, end, lower, pretrained)
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
    sentences = padding(sentences, map['<pad>'])
  return { data: [sentences, labels], map, labelMap }
}
