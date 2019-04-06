export function getAllSentences(input) {
  const sentences = []
  Object.keys(input).forEach(key => {
    input[key].forEach(sentence => sentences.push(sentence))
  })
  return sentences
}

export function getMaxLen(sentences) {
  return sentences.reduce((max, sentence) => {
    if (sentence.length > max) return sentence.length
    return max
  }, 0)
}

export function getIndexMap(strings, start, end, lower, pretrained) {
  let map = { '<pad>': 0, '<unk>': 1 }
  if (start) map['<start>'] = 2
  if (end) map['<end>'] = 3
  if (!pretrained) {
    strings.forEach(str => {
      const startLen = Object.keys(map).length
      str.split(' ').map((s, i) => {
        if (lower) s = s.toLowerCase()
        if (!(s in map)) map[s] = startLen + i
      })
    })
  } else {
    console.log(JSON.stringify(map))
    console.log(pretrained.split('\n').length)
    console.log(pretrained.split('\n')[pretrained.split('\n').length - 1])

    let words = pretrained.split('\n').map(wordvec => {
      return wordvec.substr(0, wordvec.indexOf(' '))
    })
    const startLen = Object.keys(map).length
    words.forEach((s, i) => {
      if (!(s in map)) map[s] = startLen + i
      else {
          map[s + ' '] = startLen + i  // fuck you
      }
    })
  }
  console.log(Object.keys(map).length)
  return map
}

export function shuffle(obj1, obj2) {
  let index = obj1.length
  let rnd, tmp1, tmp2

  while (index) {
    rnd = Math.floor(Math.random() * index)
    index -= 1
    tmp1 = obj1[index]
    tmp2 = obj2[index]
    obj1[index] = obj1[rnd]
    obj2[index] = obj2[rnd]
    obj1[rnd] = tmp1
    obj2[rnd] = tmp2
  }
}

export function listToIndexMap(labels) {
  let w2i = {}
  labels.forEach((c, i) => (w2i[c] = i))
  return w2i
}
