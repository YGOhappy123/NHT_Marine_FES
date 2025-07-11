import { useEffect, useState } from 'react'

type SupportedTheme = 'light' | 'dark'

export function useTheme() {
    const [theme, setTheme] = useState<SupportedTheme>(() => {
        return (localStorage.getItem('theme') as SupportedTheme) || 'light'
    })

    useEffect(() => {
        const root = document.documentElement
        root.setAttribute('data-theme', theme)

        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
    }

    return { theme, toggleTheme }
}
