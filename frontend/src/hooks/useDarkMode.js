import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const getInitialTheme = () => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('theme') === 'dark'
}

const useDarkMode = create(
    persist(
        (set) => ({
            isDarkMode: getInitialTheme(),
            setIsDarkMode: (value) => set({ isDarkMode: value })
        }),
        { name: 'theme' }
    )
)

if (typeof window !== 'undefined') {
    const initial = getInitialTheme()
    document.documentElement.classList.toggle('dark', initial)
    useDarkMode.setState({ isDarkMode: initial })
    useDarkMode.subscribe((state) => {
        document.documentElement.classList.toggle('dark', state.isDarkMode)
    })
}

export default useDarkMode