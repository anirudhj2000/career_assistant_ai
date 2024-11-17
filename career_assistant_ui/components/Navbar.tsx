"use client";
import React from 'react'
import { useStore } from '@/utils/store'
import { FileCode2, Github, Menu } from 'lucide-react'


const Navbar = () => {

    const { sidebar, setShow } = useStore()

    return (
        <div className='fixed top-0 w-full bg-white py-2 px-4 lg:px-8 flex flex-row justify-between items-center'>
            <div className='hidden lg:flex flex-row justify-between w-1/3'>
                <button className='cursor-pointer text-black px-4 py-2 rounded-md  bg-gray-300 hover:bg-gray-400'>
                    Menu
                </button>
            </div>

            <div className='flex flex-row justify-center items-center'>
                <h1 className='text-2xl font-bold text-black '>AI Career Assistant</h1>
            </ div>

            <div className='hidden lg:flex flex-row justify-end gap-x-4 w-1/3'>
                <button onClick={() => {
                    window.open("https://github.com/anirudhj2000/career_assistant_ai", "_blank")
                }} className=' flex flex-row items-center gap-x-2 px-4 rounded-md py-2 bg-gray-300 hover:bg-gray-400 text-black'>
                    <Github size={18} className=' text-black' />
                    <p className=' text-black text-sm'>Github</p>
                </button>
                <button onClick={() => {
                    window.open("https://brick-fiber-d3c.notion.site/Career-Assistant-AI-1396789c971f80f79d27d8bf3e0f4953", "_blank")
                }} className=' flex flex-row items-center gap-x-2 px-4 rounded-md py-2 bg-gray-300 hover:bg-gray-400 text-black'>
                    <FileCode2 size={18} className=' text-black' />
                    <p className=' text-black text-sm'>Documentation</p>
                </button>

            </div>
            <div className=' flex lg:hidden  flex-row justify-end w-1/3'>
                <button onClick={() => {
                    setShow({
                        ...sidebar, show: true
                    })
                }} className=' bg-gray-200 border-[1px] rounded-md p-2'>
                    <Menu size={18} className=' text-black' />
                </button>
            </div>
        </div>
    )
}

export default Navbar