'use client'

import { X } from 'lucide-react'
import * as React from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/utils'

interface SheetContextType {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SheetContext = React.createContext<SheetContextType | null>(null)

const useSheet = () => {
  const context = React.useContext(SheetContext)
  if (!context) {
    throw new Error('Sheet components must be used within a Sheet')
  }
  return context
}

interface SheetProps {
  children: React.ReactNode
  open?: boolean
  // eslint-disable-next-line no-unused-vars
  onOpenChange?: (open: boolean) => void
}

const Sheet: React.FC<SheetProps> = ({
  children,
  open: controlledOpen,
  onOpenChange,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const setOpen = React.useCallback(
    (value: React.SetStateAction<boolean>) => {
      const nextOpen = typeof value === 'function' ? value(open) : value
      if (!isControlled) {
        setUncontrolledOpen(nextOpen)
      }
      onOpenChange?.(nextOpen)
    },
    [isControlled, open, onOpenChange],
  )

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, setOpen])

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  )
}

interface SheetTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const SheetTrigger = React.forwardRef<HTMLButtonElement, SheetTriggerProps>(
  ({ className, children, asChild, onClick, ...props }, ref) => {
    const { setOpen } = useSheet()

    if (
      asChild &&
      React.isValidElement<
        React.ButtonHTMLAttributes<HTMLButtonElement> & {
          ref?: React.Ref<HTMLButtonElement>
        }
      >(children)
    ) {
      return React.cloneElement(children, {
        ...props,
        className: cn(children.props.className, className),
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
          setOpen(true)
          children.props.onClick?.(e)
          onClick?.(e)
        },
        ref,
      })
    }

    return (
      <button
        ref={ref}
        className={cn('inline-flex cursor-pointer items-center', className)}
        type='button'
        onClick={(e) => {
          setOpen(true)
          onClick?.(e)
        }}
        {...props}
      >
        {children}
      </button>
    )
  },
)
SheetTrigger.displayName = 'SheetTrigger'

interface SheetCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const SheetClose = React.forwardRef<HTMLButtonElement, SheetCloseProps>(
  ({ className, children, asChild, onClick, ...props }, ref) => {
    const { setOpen } = useSheet()

    if (
      asChild &&
      React.isValidElement<
        React.ButtonHTMLAttributes<HTMLButtonElement> & {
          ref?: React.Ref<HTMLButtonElement>
        }
      >(children)
    ) {
      return React.cloneElement(children, {
        ...props,
        className: cn(children.props.className, className),
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
          setOpen(false)
          children.props.onClick?.(e)
          onClick?.(e)
        },
        ref,
      })
    }

    return (
      <button
        ref={ref}
        className={cn('cursor-pointer', className)}
        type='button'
        onClick={(e) => {
          setOpen(false)
          onClick?.(e)
        }}
        {...props}
      >
        {children}
      </button>
    )
  },
)
SheetClose.displayName = 'SheetClose'

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'bottom' | 'left' | 'right'
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = 'right', className, children, ...props }, ref) => {
    const { open, setOpen } = useSheet()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
      setMounted(true)
    }, [])

    if (!mounted || !open) return null

    const sideClasses = {
      top: 'inset-x-0 top-0 border-b',
      bottom: 'inset-x-0 bottom-0 border-t',
      left: 'inset-y-0 left-0 h-full w-3/4 max-w-sm border-r',
      right: 'inset-y-0 right-0 h-full w-3/4 max-w-sm border-l',
    }

    return createPortal(
      <div className='fixed inset-0 z-50 flex'>
        {/* Backdrop overlay */}
        <div
          className='fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-out'
          onClick={() => setOpen(false)}
        />

        {/* Drawer content */}
        <div
          ref={ref}
          className={cn(
            'fixed z-50 flex flex-col gap-4 border-neutral-200 bg-white p-6 shadow-2xl transition-transform duration-300 ease-out dark:border-neutral-800 dark:bg-neutral-900',
            sideClasses[side],
            className,
          )}
          {...props}
        >
          <button
            className='ring-offset-background absolute top-4 right-4 cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-neutral-400 focus:outline-none'
            type='button'
            onClick={() => setOpen(false)}
          >
            <X className='h-5 w-5' />
            <span className='sr-only'>Close</span>
          </button>
          {children}
        </div>
      </div>,
      document.body,
    )
  },
)
SheetContent.displayName = 'SheetContent'

const SheetHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      'flex flex-col space-y-2 text-center sm:text-left',
      className,
    )}
    {...props}
  />
)
SheetHeader.displayName = 'SheetHeader'

const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      'text-lg font-semibold text-neutral-900 dark:text-neutral-50',
      className,
    )}
    {...props}
  />
))
SheetTitle.displayName = 'SheetTitle'

const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-neutral-500 dark:text-neutral-400', className)}
    {...props}
  />
))
SheetDescription.displayName = 'SheetDescription'

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
}
