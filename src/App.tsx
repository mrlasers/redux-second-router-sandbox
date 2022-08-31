import './App.css'

import { compile, match, MatchFunction, parse, PathFunction, pathToRegexp } from 'path-to-regexp'
import { useEffect, useState } from 'react'

import reactLogo from './assets/react.svg'

type RoutesMap = {
  [key: string]: string
}

const routesMap = {
  HOME: '/',
  BUTTHOLES: '/buttholes/:id?',
}

function connectRoutes(routes: RoutesMap) {
  const mapRoutes = Object.keys(routes).reduce<
    [MatchFunction, PathFunction, string][]
  >((acc, page) => {
    const path = compile(routes[page])
    // console.log('path', path)
    return [
      ...acc,
      [
        match(routes[page], { decode: decodeURIComponent }),
        compile(routes[page], { encode: encodeURI }),
        page,
      ],
    ]
  }, [])

  return {
    parsePath: function parsePath(path: string) {
      for (let i = 0; i < mapRoutes.length; i++) {
        const [frompath, topath, pagename] = mapRoutes[i]
        const match = frompath(path)
        if (match) {
          return {
            page: pagename,
            path: match.path,
            params: match.params,
          }
        }
      }
    },
    parsePage: function parsePath(page?: string, params?: {}) {
      for (let i = 0; i < mapRoutes.length; i++) {
        const [frompath, topath, pagename] = mapRoutes[i]
        console.log('parsePage', pagename, page)
        if (page === pagename) {
          return topath(params)
        }
      }
    },
  }
}

function App() {
  const [count, setCount] = useState(0)
  const [location, setLocation] = useState<Location>(document.location)

  const { parsePath, parsePage } = connectRoutes(routesMap)

  const locationData = parsePath(document.location.pathname)

  console.log('parsePath...', locationData?.path, locationData?.params)
  console.log(
    'parsePage...',
    parsePage(locationData?.path, locationData?.params)
  )

  // const path = '/buttholes/:somebutthole/:age'
  // const token = parse(path)[1]
  // console.log('token:', token)

  // const regexp = pathToRegexp(path, [])
  // console.log('regexp.exec', regexp.exec(document.location.pathname))

  // const matcher = match(path, { decode: decodeURIComponent })
  // console.log('matcher', matcher(document.location.pathname))

  // useEffect(() => {
  //   console.log(JSON.stringify(parse(document.location.pathname)))
  // }, [document.location])

  return (
    <div className='App'>
      <button>👈</button>
      <input type='text' />
      <button>👉</button>
    </div>
  )
}

export default App
