import * as Parser from './parser'

const routesMap: Parser.RoutesMap = {
  HOME: '/',
  USERS: '/users/:id?',
  DOGS: '/dogs/breed?/:id?',
  ABOUT: '/about',
}

describe('users', () => {
  const { toMatch, toPath, pageName } = Parser.pagePathToParsers(
    'USERS',
    '/users/:id?'
  )

  it('matches no users', () => {
    const path = '/users'
    const result = toMatch(path)
    expect(result).toMatchObject({
      path: path,
      params: {},
    })
  })

  it('matches user mrlasers', () => {
    const path = '/users/mrlasers'
    expect(toMatch(path)).toMatchObject({
      path: path,
      params: { id: 'mrlasers' },
    })
  })

  describe('the unhappy path', () => {
    it(`doesn't match /buttholes`, () => {
      expect(toMatch('/buttholes')).toBe(false)
    })

    it(`doesn't match /users/mrlasers/profile`, () => {
      expect(toMatch('/users/mrlasers/profile')).toBe(false)
    })
  })
})
