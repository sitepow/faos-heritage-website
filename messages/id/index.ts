import content from './content'
import ui from './ui'

export const id = {
  ...ui,
  ...content,
} as const

export default id
