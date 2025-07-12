import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'
import { Moon, Sun } from 'lucide-react'

const ThemeToggler = () => {
    const { theme, toggleTheme } = useTheme()

    return (
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun /> : <Moon />}
        </Button>
    )
}

export default ThemeToggler
