import { compile, match, MatchFunction, parse, PathFunction, pathToRegexp } from 'path-to-regexp'

export function doNothing() {
  return null
}

export const matchButtholes = match('/buttholes/:id?')

// src for ExtractRouteParams: https://bit.ly/3KSF22g
type ExtractRouteParams<T extends string> = string extends T
  ? Record<string, string>
  : (T extends `${infer Start}:${infer Param}/${infer Rest}`
    ? { [k in Param | keyof ExtractRouteParams<Rest>]: string }
    : (T extends `${infer Start}:${infer Param}`
      ? { [k in Param]: string }
      : {}))



function _compile<Path extends string>(
  path: Path,
  data: ExtractRouteParams<Path>
) {
  return compile(path, data)
}

function compileParams<Path extends string>(path: Path) {
  return (data: ExtractRouteParams<Path>) => {
    return data
  }
}

type ExtractOptionalShit<T extends string> = T extends `/${infer start}?` ? { [key in start]?: string } : T extends `/${infer start}` ?  {[key in start]: string} : {}

function boopCompile<Path extends string(path: Path) {
  return (data: ExtractOptionalShit<Path>) => {
    return data
  }
}

const boop = boopCompile('/hello?')({hello: 'boop'})

const actionCreator = compileParams('/users/:view/:id?')

const record: Record<string, string> = { hello: 'world' }

const $compile = _compile('/users/:userId', { userId: 'mrlasers' })

// compile('/user/:id', { id: 'foo' })

// // Unknown path parameter.
// compile('/user/:id', { id: 'foo', bar: '2' })

// // Missing path parameter.
// compile('/user/:id', {})

export type RoutesMap = {
  [key: string]: string
}

export type ParserFunctions = {
  toMatch: MatchFunction
  toPath: PathFunction
  pageName: string
}

export function pagePathToParsers(page: string, path: string) {
  return { toMatch: match(path), toPath: compile(path), pageName: page }
}

// const routesMap = {
//   HOME: '/',
//   BUTTHOLES: '/buttholes/:id?',
// }

// function connectRoutes(routes: RoutesMap) {
//   const mapRoutes = Object.keys(routes).reduce<
//     [MatchFunction, PathFunction, string][]
//   >((acc, page) => {
//     const path = compile(routes[page])
//     // console.log('path', path)
//     return [
//       ...acc,
//       [
//         match(routes[page], { decode: decodeURIComponent }),
//         compile(routes[page], { encode: encodeURI }),
//         page,
//       ],
//     ]
//   }, [])

//   return {
//     parsePath: function parsePath(path: string) {
//       for (let i = 0; i < mapRoutes.length; i++) {
//         const [frompath, topath, pagename] = mapRoutes[i]
//         const match = frompath(path)
//         if (match) {
//           return {
//             page: pagename,
//             path: match.path,
//             params: match.params,
//           }
//         }
//       }
//     },
//     parsePage: function parsePath(page?: string, params?: {}) {
//       for (let i = 0; i < mapRoutes.length; i++) {
//         const [frompath, topath, pagename] = mapRoutes[i]
//         console.log('parsePage', pagename, page)
//         if (page === pagename) {
//           return topath(params)
//         }
//       }
//     },
//   }
// }
