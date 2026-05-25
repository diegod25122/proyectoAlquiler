import React from 'react'
import sello from '../assets/selloEPN.png'
import useDarkMode from '../hooks/useDarkMode'

export const Navbar = () => {
    const { isDarkMode, setIsDarkMode } = useDarkMode()

    return (
        <div >
        <nav className="flex justify-between items-center px-6 py-3 
                        bg-white dark:bg-gray-900 transition-colors duration-300">
            
            {/* Logo */}
           <div className="flex items-center gap-3">
            <img src={sello} alt="Sello EPN" className="w-23 h-18"/>
            </div>
            
            {/* Navigation Links */}
            <ul className="flex gap-6">
                <li><a href="#" className="font-medium text-gray-800 dark:text-white hover:text-blue-600">Home</a></li>
                <li><a href="/login" className="font-medium text-gray-800 dark:text-white hover:text-blue-600">Login</a></li>
                <li><a href="/register" className="font-medium text-gray-800 dark:text-white hover:text-blue-600">Register</a></li>
            </ul>     

            <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 
                           rounded-md hover:bg-gray-300 transition-colors"
            >
                {isDarkMode ? '☀️' : '🌙'}
            </button>
        </nav>
        </div>
    )
}