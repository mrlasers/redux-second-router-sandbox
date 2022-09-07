import { compile as compileOG } from 'path-to-regexp'

import { compile } from './types'

describe('compile', () => {
  describe('splat', () => {
    it('end in splat', () => {
      const fun = compile('/path/:splat*')
      expect(fun({ splat: 'a' })).toBe('/path/a')
      expect(fun({ splat: ['a', 'b', 'c'] })).toBe('/path/a/b/c')
    })
    it('splat in middle', () => {
      const fun = compile('/path/:splat*/:tail')
      expect(fun({ splat: 'a', tail: 'the-end' })).toBe('/path/a/the-end')
      expect(fun({ splat: ['a', 'b', 'c'], tail: 'the-end' })).toBe(
        '/path/a/b/c/the-end'
      )
    })
  })
})

it('compiles a path', () => {
  const fun = compile('/users/:username')
  expect(fun({ username: 'mrlasers' })).toBe('/users/mrlasers')
})

it('compiles a path with optional segment', () => {
  const fun = compile('/users/:username?')

  expect(fun({})).toBe('/users')
})

it('does not require params if there are no keys', () => {
  const fun = compile('/users/profile')

  expect(fun()).toBe('/users/profile')
})

it('compiles a path with multiple optional segments', () => {
  const fun = compile('/users/:username?/:page?')

  expect(fun({ username: 'mrlasers', page: 'profile' })).toBe(
    '/users/mrlasers/profile'
  )
})

it('compiles a path with first optional segment not provided', () => {
  const fun = compile('/users/:username?/:page?')

  expect(fun({ page: 'profile' })).toBe('/users/profile')
})

describe('path-to-regexp', () => {
  it('compiles a path with optional parameter omitted', () => {
    const fun = compileOG('/users/:username?')
    expect(fun()).toBe('/users')
  })
  it('compiles a path with optional parameter', () => {
    const fun = compileOG('/users/:username?')
    expect(fun({ username: 'mrlasers' })).toBe('/users/mrlasers')
  })
  it('compiles a path with optional parameter omitted in the middle', () => {
    const fun = compileOG('/users/:username?/profile')
    expect(fun()).toBe('/users/profile')
  })
  it('compiles a path with optional parameter in the middle', () => {
    const fun = compileOG('/users/:username?/profile')
    expect(fun({ username: 'mrlasers' })).toBe('/users/mrlasers/profile')
  })

  describe('segment+', () => {
    it('does a multi-segment path', () => {
      const fun = compileOG('/path/:stuff+')
      expect(fun({ stuff: ['a', 'b', 'c'] })).toBe('/path/a/b/c')
    })

    it('does a multi-segment path with required at the end', () => {
      const fun = compileOG('/path/:stuff+/:tail')
      expect(fun({ stuff: ['a', 'b', 'c'], tail: 'boo' })).toBe(
        '/path/a/b/c/boo'
      )
    })

    it('does a path with a splat', () => {
      const fun = compileOG('/path/:splat*')
      expect(fun({ splat: 'boo' })).toBe('/path/boo')
      expect(fun({ splat: ['boo', 'chuckie'] })).toBe('/path/boo/chuckie')
    })

    it('does a path with a splat followed by required', () => {
      const fun = compileOG('/path/:splat*/:username')
      expect(fun({ splat: 'boo', username: 'chuckie' })).toBe(
        '/path/boo/chuckie'
      )
      expect(fun({ username: 'chuckie' })).toBe('/path/chuckie')
    })

    it('does a path with query params', () => {
      const fun = compileOG('/user/:username\\?big=time')
      expect(fun({ username: 'mrlasers' })).toBe('/user/mrlasers?big=time')
    })
    it('does a path with configurable query param', () => {
      const fun = compileOG('/user/:username\\?name=:name&age=:age')
      expect(fun({ username: 'mrlasers', name: 'Timothy', age: 40 })).toBe(
        '/user/mrlasers?name=Timothy&age=40'
      )
    })
    it('does a path with a named thing in the middle', () => {
      const fun = compileOG('/user:name')
      expect(fun({ name: 'mrlasers' })).toBe('/usermrlasers')
    })
    it('does two keywords in a row', () => {
      const fun = compileOG('/:a:b')
      expect(fun({ a: 'hello', b: 'world' })).toBe('/helloworld')
    })
  })
})
