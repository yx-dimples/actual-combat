import storage from 'good-storage'
const tokenPrefix = 'token'

export function setToken (token: string): string {
  storage.set(tokenPrefix, token)
  return token
}

export function getToken (): string {
  return storage.get(tokenPrefix)
}

export function removeToken (): void {
  storage.remove(tokenPrefix)
}

export function set (key: string, value: any): void {
  return storage.set(key, value)
}

export function get (key: string): void {
  return storage.get(key)
}

export function remove (key: string): void {
  return storage.remove(key)
}

export function clear (): void {
  return storage.clear()
}
