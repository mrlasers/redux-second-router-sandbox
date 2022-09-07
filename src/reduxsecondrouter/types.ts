// import { compile, match, MatchFunction, parse, PathFunction, pathToRegexp } from 'path-to-regexp'

import * as PathToRegexp from 'path-to-regexp'

type CREATETYPE<K extends string, NS extends string> = NS extends `${infer NS}`
  ? `${NS}/${K}`
  : K

function generateDynamicTypes<T extends string, NS extends string>(
  keys: T[],
  namespace?: NS
): { [K in T]: CREATETYPE<K, NS> } {
  const namespacePrefix: string = namespace ? `${namespace}/` : ''

  return keys.reduce((res, key) => {
    res[key] = `${namespacePrefix}${key}`
    return res
  }, Object.create(null))
}

type MatchPair<S extends string> = S extends `[${infer A},${infer B}]`
  ? [A, B]
  : unknown
type T20 = MatchPair<'[1,2]'> // ['1', '2']

// src for ExtractRouteParams: https://bit.ly/3KSF22g
type ExtractRouteParams<T extends string> = string extends T
  ? Record<string, string>
  : T extends `${infer Start}:${infer Param}/${infer Rest}`
  ? { [k in Param | keyof ExtractRouteParams<Rest>]: string }
  : T extends `${infer Start}:${infer Param}`
  ? { [k in Param]: string }
  : {}

// type ParamString<T extends string> =
//   T extends `${infer Start}:${infer Param extends Segment}${Terminator}${infer Rest}`
//     ? { [k in Param]: string } & ParamString<Rest>
//     : T extends `${infer Start}:${infer Param extends Segment}?${Terminator}${infer Rest}`
//     ? { [k in Param]?: string } & ParamString<Rest>
//     : T extends `${infer Start}:${infer Param}`
//     ? { [k in Param]: string }
//     : {}

// function testParam<Path extends string>(param: Path) {
//   return (keys: ParamString<Path>) => ''
// }

// const testFunc = testParam('hello/:world?\\?name=:name')

type Terminator = '/' | '|' | ',' | '&' // | '\\?'

type NotLetters = Exclude<string, Letters>

type ParamAs<
  Param extends string,
  T
> = Param extends `${infer Keyword}?${infer Rest}`
  ? { [k in Keyword]?: T }
  : Param extends `${infer Keyword}*${infer Rest}`
  ? { [k in Keyword]?: T | T[] }
  : Param extends `${infer Keyword}`
  ? { [k in Keyword]: T }
  : never

type ExtractParams<T> = string extends T
  ? Record<string, string>
  : T extends `${infer Start}:${infer Param}:${infer Rest}`
  ? ParamAs<Param, string> & ExtractParams<`:${Rest}`>
  : T extends `${infer Start}:${infer Param}/${infer Rest}`
  ? ParamAs<Param, string> & ExtractParams<Rest>
  : T extends `${infer Start}:${infer Param}\\?${infer Rest}`
  ? ParamAs<Param, string> & ExtractParams<Rest>
  : T extends `${infer Start}:${infer Param}${Terminator}${infer Rest}`
  ? ParamAs<Param, string> & ExtractParams<Rest>
  : T extends `${infer Start}:${infer Param}`
  ? ParamAs<Param, string>
  : {}

type params = ExtractParams<'/path/:buttholes?|/:splat*\\?name=:name&age=:age'>

type params2 = ExtractParams<'/path/:a:b'>

type Letters =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'

type MyExtractRouteParams<T extends string> = string extends T
  ? Record<string, string>
  : T extends `${infer Start}:${infer Param}*/${infer Rest}`
  ? { [k in Param]?: string | string[] } & MyExtractRouteParams<Rest>
  : T extends `${infer Start}:${infer Param}?/${infer Rest}`
  ? { [k in Param]?: string } & MyExtractRouteParams<Rest>
  : T extends `${infer Start}:${infer Param}/${infer Rest}`
  ? { [k in Param]: string } & MyExtractRouteParams<Rest>
  : T extends `${infer Start}:${infer Param}*`
  ? { [k in Param]?: string | string[] }
  : T extends `${infer Start}:${infer Param}?`
  ? { [k in Param]?: string }
  : T extends `${infer Start}:${infer Param}`
  ? { [k in Param]: string }
  : never

const configured = compile('/users/:username?/:page?')

configured

type CompileFunction<Path extends string> =
  MyExtractRouteParams<Path> extends never
    ? (keys?: never) => string
    : (keys: MyExtractRouteParams<Path>) => string

type EvilMagic<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

type ParamsOrNever<T, R> = T extends never ? () => R : (arg: T) => R

export function compile<Path extends string>(
  path: Path
): MyExtractRouteParams<Path> extends never
  ? () => string
  : (keys: MyExtractRouteParams<Path>) => string {
  const compiled = PathToRegexp.compile(path)

  // return compiled

  // return function (keys: MyExtractRouteParams<Path>): string {
  //   return compiled(keys)
  // }

  function overloaded(): string
  function overloaded(keys: MyExtractRouteParams<Path>): string
  function overloaded(keys?: MyExtractRouteParams<Path>): string {
    return compiled(keys || {})
  }

  return overloaded
}

function conditionalReturn<T>(
  param: T
): T extends string ? () => void : (n: number) => void {
  function overloaded(): void
  function overloaded(n: number): void
  function overloaded(param?: number | undefined): void {
    console.log(param)
  }

  return overloaded
}

const cr = conditionalReturn('klksdf')
