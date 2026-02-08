import content from './content'
import ui from './ui'

export const us = {
  ...ui,
  ...content,
} as const

export default us
