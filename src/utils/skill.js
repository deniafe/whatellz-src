import { nanoid } from 'nanoid'

export function bot() {
  return {
    id: nanoid(),
    title: '',
    key: '',
    skills: [],
  }
}

export function skill() {
  return {
    id: nanoid(),
    title: '',
    actions: [],
  }
}

export function action() {
  return {
    id: nanoid(),
    title: '',
    body: '',
  }
}
