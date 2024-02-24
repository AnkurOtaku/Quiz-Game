import React from 'react'

function RouteError() {
  return (
    <>
    <div className="px-4 text-center font-bold h-[75vh] gap-4 grid justify-items-center content-center overflow-hidden">
      <div className='text-5xl bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent'>Oops !</div>
      <div>404 | Page Not Found</div>
    </div>
    </>
  )
}

export default RouteError