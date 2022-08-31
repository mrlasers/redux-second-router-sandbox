import { compile, match, MatchFunction, parse, PathFunction, pathToRegexp } from 'path-to-regexp'

export function doNothing() {
  return null
}

export const matchButtholes = match('/buttholes/:id?')

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
