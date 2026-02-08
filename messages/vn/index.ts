import content from './content'
import ui from './ui'

export const vn = {
  ...ui,
  ...content,
} as const

export default vn
