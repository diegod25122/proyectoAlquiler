
import sello from '../assets/selloEPN.png'
import useDarkMode from '../hooks/useDarkMode'
import {Link} from 'react-router-dom'

export const Navbar = () => {
    const { isDarkMode, setIsDarkMode } = useDarkMode()

    return (
        <nav className="flex justify-between items-center px-3 py-1 
                        bg-white dark:bg-gray-900 transition-colors duration-300">

            {/* Logo */}
            <div className="flex items-center gap-3">
                <img src={sello} alt="Sello EPN" className="w-20 mx-auto mb-4" />
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Poli Rent</h1>
            </div>

            {/* Navigation Links */}
            <ul className=" hidden md:flex gap-6">
                <li><Link to="/" className="font-medium text-gray-800 dark:text-white hover:text-blue-600">Home</Link></li>
                <li><Link to="/login" className="font-medium text-gray-800 dark:text-white hover:text-blue-600">Login</Link></li>
                <li><Link to="/register" className="font-medium text-gray-800 dark:text-white hover:text-blue-600">Register</Link></li>
            </ul>

            <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 
                           rounded-md hover:bg-gray-300 transition-colors"
            >
                {isDarkMode ? '☀️' : '🌙'}
            </button>
        </nav>

    )
}