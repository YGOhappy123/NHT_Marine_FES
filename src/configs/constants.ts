import { SiFacebook, SiYoutube, SiTiktok, SiInstagram, SiX, IconType } from '@icons-pack/react-simple-icons'

type SocialLink = {
    platform: string
    url: string
    Icon: IconType
}

export const SOCIAL_LINKS: SocialLink[] = [
    { platform: 'facebook', url: 'https://www.facebook.com', Icon: SiFacebook },
    { platform: 'youtube', url: 'https://youtube.com', Icon: SiYoutube },
    { platform: 'tiktok', url: 'https://www.tiktok.com', Icon: SiTiktok },
    { platform: 'instagram', url: 'https://www.instagram.com', Icon: SiInstagram },
    { platform: 'x', url: 'https://x.com', Icon: SiX }
]

export const LOGIN_SESSION_EXPIRED_MESSAGE = 'Phiên đăng nhập hết hạn. Xin vui lòng đăng nhập lại.'

export const INTRODUCTION_VIDEO_URL = 'https://youtube.com'

export const AUTH_CAROUSEL_IMAGES = [
    'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6ee3f4d4-8cc0-4b77-b9a0-ed16b350bf18/dg7egt3-c4e91a6d-c40c-43f2-b256-7466bcc9a126.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzZlZTNmNGQ0LThjYzAtNGI3Ny1iOWEwLWVkMTZiMzUwYmYxOFwvZGc3ZWd0My1jNGU5MWE2ZC1jNDBjLTQzZjItYjI1Ni03NDY2YmNjOWExMjYuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.1pkj9fs2XuJH77mrn_vRkxUUrtWGtz_b6aMDl-mM4js'
]

export const BADGE_COLORS = ['#9b5de5', '#f15bb5', '#fee440', '#00bbf9', '#00f5d4']
