/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import * as React from 'react'

import { cn } from '@/utils'

interface DropdownMenuContextType {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType | null>(
  null,
)

const useDropdownMenu = () => {
  const context = React.useContext(DropdownMenuContext)
  if (!context) {
    throw new Error(
      'DropdownMenu components must be used within a DropdownMenu',
    )
  }
  return context
}

interface DropdownMenuProps {
  children: React.ReactNode
  open?: boolean
  // eslint-disable-next-line no-unused-vars
  onOpenChange?: (open: boolean) => void
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
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

  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, setOpen])

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div ref={containerRef} className='relative inline-block text-left'>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(({ className, children, asChild, onClick, ...props }, ref) => {
  const { open, setOpen } = useDropdownMenu()

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
      'aria-expanded': open,
      'aria-haspopup': 'true',
      className: cn(children.props.className, className),
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        setOpen((prev) => !prev)
        children.props.onClick?.(e)
        onClick?.(e)
      },
      ref,
    })
  }

  return (
    <button
      ref={ref}
      aria-expanded={open}
      aria-haspopup='true'
      className={cn('inline-flex cursor-pointer items-center', className)}
      type='button'
      onClick={(e) => {
        setOpen((prev) => !prev)
        onClick?.(e)
      }}
      {...props}
    >
      {children}
    </button>
  )
})
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger'

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
}

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(({ className, align = 'start', children, ...props }, ref) => {
  const { open } = useDropdownMenu()

  if (!open) return null

  const alignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'animate-in fade-in-0 zoom-in-95 absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-xl border border-neutral-200/80 bg-white/95 p-1.5 text-neutral-950 shadow-xl backdrop-blur-md transition-all dark:border-neutral-800/80 dark:bg-neutral-900/95 dark:text-neutral-50',
        alignmentClasses[align],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
DropdownMenuContent.displayName = 'DropdownMenuContent'

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean
  disabled?: boolean
  asChild?: boolean
}

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuItemProps
>(
  (
    { className, inset, disabled, asChild, onClick, children, ...props },
    ref,
  ) => {
    const { setOpen } = useDropdownMenu()

    const itemClass = cn(
      'relative flex cursor-pointer items-center rounded-lg px-2.5 py-2 text-sm font-medium transition-colors outline-none select-none hover:bg-neutral-100 hover:text-neutral-900 focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 dark:focus:bg-neutral-800 dark:focus:text-neutral-50',
      inset && 'pl-8',
      disabled && 'pointer-events-none opacity-50',
      className,
    )

    const handleClick = (e: React.MouseEvent<any>) => {
      if (disabled) return
      onClick?.(e)
      setOpen(false)
    }

    if (asChild && React.isValidElement<any>(children)) {
      return React.cloneElement(children, {
        ...props,
        className: cn(itemClass, (children.props as any).className),
        onClick: (e: React.MouseEvent<any>) => {
          ;(children.props as any).onClick?.(e)
          handleClick(e)
        },
        role: 'menuitem',
        ref,
      })
    }

    return (
      <div
        ref={ref}
        className={itemClass}
        role='menuitem'
        onClick={handleClick}
        {...props}
      >
        {children}
      </div>
    )
  },
)
DropdownMenuItem.displayName = 'DropdownMenuItem'

const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'px-2.5 py-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = 'DropdownMenuLabel'

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      '-mx-1 my-1 h-px bg-neutral-200 dark:bg-neutral-800',
      className,
    )}
    {...props}
  />
))
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator'

const DropdownMenuGroup: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn('flex flex-col gap-0.5', className)} {...props} />

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
}
