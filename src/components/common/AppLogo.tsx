import { twMerge } from 'tailwind-merge'

type AppLogoProps = {
    reverse: boolean
}

const AppLogo = ({ reverse }: AppLogoProps) => {
    return (
        <div className={twMerge(`flex items-center gap-2 px-2 ${reverse ? 'flex-row-reverse' : 'flex-row'}`)}>
            <div className="h-10 w-10">
                <img src="/images/no-text-logo.png" alt="NHT Marine logo" className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col items-center">
                <span className="text-sidebar-foreground text-nowrap text-sm font-bold">NHT MARINE</span>
                <span className="text-nowrap text-xs font-bold text-[#5b62ad] tracking-widest">AQUATIC ARTISTRY</span>
            </div>
        </div>
    )
}

export default AppLogo
