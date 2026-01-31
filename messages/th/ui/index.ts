import auth from './auth.json'
import common from './common.json'
import dropzone from './dropzone.json'
import footer from './footer.json'
import navigation from './navigation.json'
import store from './store.json'
import transaction from './transaction.json'
import user from './user.json'

export const ui = {
  ...common,
  ...footer,
  ...navigation,
  ...auth,
  ...dropzone,
  ...store,
  ...transaction,
  ...user,
}

export default ui
