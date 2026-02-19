import advertise from './advertise.json'
import affiliate from './affiliate.json'
import brand from './brand.json'
import page from './page.json'
import seo from './seo.json'

export const content = {
  ...brand,
  ...advertise,
  ...page,
  ...seo,
  ...affiliate,
}

export default content
