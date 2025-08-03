import { twMerge } from 'tailwind-merge'

type AppLogoProps = {
    reverse?: boolean
    className?: string
}

const AppLogo = ({ reverse = false, className }: AppLogoProps) => {
    return (
        <div
            className={twMerge(
                `flex items-center gap-2 px-2 ${reverse ? 'flex-row-reverse' : 'flex-row'} ${className}`
            )}
        >
            <div className="h-10 w-10">
                <img src="/images/no-text-logo.png" alt="NHT Marine logo" className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col items-center">
                <span className="text-sidebar-foreground text-sm font-bold text-nowrap">NHT MARINE</span>
                <span className="text-xs font-bold tracking-widest text-nowrap text-[#5b62ad]">AQUATIC ARTISTRY</span>
            </div>
        </div>
    )
}

export default AppLogo
