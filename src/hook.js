import { useState, useEffect } from 'react'

export const useLocalStorage = (key, value) => {
  const [state, setState] = useState(value)

  if (window.localStorage.getItem(key) !== null) {
    setState(JSON.parse(window.localStorage.getItem(key)))
  }

  useEffect(
    () => {
      window.localStorage.setItem(key, JSON.stringify(value))
    },
    [state]
  )

  return [state, setState]
}
