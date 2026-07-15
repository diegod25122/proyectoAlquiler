// pages/Home.jsx
import { Navbar } from '../components/Navbar'
import { HeroCarousel } from '../components/home/HeroCarousel'
import { AboutSection } from '../components/home/AboutSection'
import { Catalog } from '../components/home/Catalog'
import { Footer } from '../components/Footer'

export const Home = () => {
    return (
        <div className="min-h-screen bg-[#F5F7FA] dark:bg-gray-950 transition-colors duration-300">
            <Navbar />
            <HeroCarousel />
            <AboutSection />
            <Catalog />
            <Footer />
        </div>
    )
}