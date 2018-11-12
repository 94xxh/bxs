import Cookies from 'js-cookie'

const TokenKey = 'authToken'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, expires) {
  return Cookies.set(TokenKey, token, {
    expires: expires | 5
  })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
