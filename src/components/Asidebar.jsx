import React from 'react'
import {  HomeIcon, UserGroupIcon,InboxIcon,RectangleStackIcon,ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/solid'

const Asidebar = () => {
  return (
    <div className='bg-slate-800 w-14 sm:w-20 h-screen'>
        <div className='h-20 items-center flex'>
            <HomeIcon  width={30} className='text-gray-300 left-3 sm:left-6 fixed'></HomeIcon>
        </div>
        <div className='fixed top-[100px] left-3 sm:left-6'>
            <UserGroupIcon width={40} className=' bg-gray-600 p-2 rounded-lg mb-4 text-gray-300 '></UserGroupIcon>
            <InboxIcon width={40} className=' bg-gray-600 p-2 rounded-lg mb-4 text-gray-300 '></InboxIcon>
            <RectangleStackIcon width={40} className=' bg-gray-600 p-2 rounded-lg mb-4 text-gray-300 '></RectangleStackIcon>
        </div>
        <div className='fixed bottom-4 left-3 sm:left-6'>
            <ArrowLeftEndOnRectangleIcon width={40} className='bg-red-600 text-white rounded-lg p-2'>

            </ArrowLeftEndOnRectangleIcon>
        </div>
        
    </div>
  )
}

export default Asidebar