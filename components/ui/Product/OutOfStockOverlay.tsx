const OutOfStockOverlay = () => (
  <div className='absolute inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-md'>
    <span className='rounded-full bg-zinc-900 px-4 py-1 text-[10px] font-black text-white uppercase'>
      Empty
    </span>
  </div>
)

export { OutOfStockOverlay }
