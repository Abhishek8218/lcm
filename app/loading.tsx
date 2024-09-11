import { LucideLoader2 } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
    <div >
    <LucideLoader2 size={32} className=" absolute  animate-spin top-1/2 left-1/2"/>
    </div>
  )
}

export default Loading
