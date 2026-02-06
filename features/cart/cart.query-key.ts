type CartStatParams = {
  userId?: string
}

const cartRootKey = ['carts'] as const

const cartQueryKeys = {
  root: cartRootKey,

  list: {
    all: (params: CartStatParams) => [...cartRootKey, 'list', params] as const,
  },

  stat: {
    byUser: (params: CartStatParams) =>
      [...cartRootKey, 'stat', params] as const,
  },
}

export { cartQueryKeys }
