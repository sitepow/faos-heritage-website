const YouTubeList = () => {
  const videoList: string[] = [
    'https://www.youtube.com/watch?v=PyuUYV_t5II&feature=youtu.be',
    'https://www.youtube.com/watch?v=WJrdmNl3F8o',
  ]

  const getYouTubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\\&v=)([^#\\&\\?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  return (
    <div className='container mx-auto'>
      <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
        {videoList.map((url, index) => {
          const videoId = getYouTubeId(url)

          if (!videoId) {
            return null
          }

          return (
            <div key={index} className='flex flex-col gap-2'>
              <div className='relative h-0 w-full overflow-hidden rounded-xl pb-[56.25%] shadow-lg'>
                <iframe
                  allowFullScreen
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                  className='absolute top-0 left-0 h-full w-full'
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title='YouTube video player'
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { YouTubeList }
