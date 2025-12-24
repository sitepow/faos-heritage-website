export const getPathFromPublicUrl = (url: string) => {
  const marker = '/object/public/uploads/'

  return url.split(marker)[1]
}
