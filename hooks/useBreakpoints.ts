import { useMediaQuery } from 'react-responsive'

const useIsSm = () => {
  return useMediaQuery({
    query: '(min-width: 640px)',
  })
}

const useIsMd = () => {
  return useMediaQuery({
    query: '(min-width: 768px)',
  })
}

const useIsLg = () => {
  return useMediaQuery({
    query: '(min-width: 1024px)',
  })
}

const useIsXl = () => {
  return useMediaQuery({
    query: '(min-width: 1280px)',
  })
}

const useIs2xl = () => {
  return useMediaQuery({
    query: '(min-width: 1536px)',
  })
}

const useIsMobile = () => {
  return useMediaQuery({
    query: '(max-width: 639px)',
  })
}

export { useIs2xl, useIsLg, useIsMd, useIsMobile, useIsSm, useIsXl }
