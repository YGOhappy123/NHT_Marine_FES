import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'

type AuthCarouselProps = {
    images: string[]
    size: {
        width: number
        height: number
    }
    autoplayDuration?: number
}

const AuthCarousel = ({ images, size, autoplayDuration = 2000 }: AuthCarouselProps) => {
    return (
        <Carousel
            plugins={[
                Autoplay({
                    delay: autoplayDuration
                })
            ]}
        >
            <CarouselContent
                style={{
                    width: size.width,
                    height: size.height
                }}
            >
                {images.map(imageUrl => (
                    <CarouselItem key={imageUrl}>
                        <div className="flex h-full items-center justify-center overflow-hidden rounded-lg">
                            <img
                                src={imageUrl}
                                alt="auth banner image"
                                className="min-h-full min-w-full object-cover"
                            />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    )
}

export default AuthCarousel
