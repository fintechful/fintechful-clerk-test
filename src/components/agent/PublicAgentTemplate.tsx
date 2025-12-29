// src/components/agent/PublicAgentTemplate.tsx
"use client"

import { Button } from "@/components/ui/button"
import {
    ArrowRight,
    Users,
    Rocket,
    DollarSign,
    CreditCard,
    Calculator,
    MapPin,
    BookOpen,
    User,
    Mail,
    Menu,
    X,
    Phone,
    Linkedin,
    Twitter,
    Facebook,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import '@/styles/agent-css.css'

type Profile = {
    full_name: string
    avatar_url: string
    bio: string
    email: string
    phone?: string
    // Future customization fields (add to Supabase profiles table)
    custom_headline?: string
    primary_color?: string // e.g., "#00A3AD"
    show_consumer_section?: boolean
    show_resources_section?: boolean
    custom_cta_text?: string
}

export default function PublicAgentTemplate({ profile }: { profile: Profile }) {
    // Mobile menu
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    // Rotating headline (can be overridden per agent later)
    const [currentHeadline, setCurrentHeadline] = useState(0)
    const defaultHeadlines = ["A Plentiful Financial Future", "Thriving Business Growth", "Abundant Opportunities"]
    const headlines = profile.custom_headline ? [profile.custom_headline] : defaultHeadlines

    // Primary color fallback
    const primaryColor = profile.primary_color || "#00A3AD"



    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        if (headlines.length > 1) {
            const interval = setInterval(() => {
                setCurrentHeadline((prev) => (prev + 1) % headlines.length)
            }, 3000)
            return () => clearInterval(interval)
        }
    }, [headlines.length])

    // Fade-in refs
    const imageRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const businessRef = useRef<HTMLDivElement>(null)
    const consumerRef = useRef<HTMLDivElement>(null)
    const resourcesRef = useRef<HTMLDivElement>(null)
    const aboutRef = useRef<HTMLDivElement>(null)
    const finalCtaRef = useRef<HTMLDivElement>(null)
    const bannerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate-fade-in")
                    }
                })
            },
            { threshold: 0.1 }
        )

        const refs = [imageRef, contentRef, businessRef, consumerRef, resourcesRef, aboutRef, finalCtaRef, bannerRef]
        refs.forEach((ref) => ref.current && observer.observe(ref.current))

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (profile?.full_name) {
            document.title = `${profile.full_name} | FinTechful Agent – Growth, Leads & Funding`
        } else {
            document.title = "FinTechful Agent"
        }
    }, [profile?.full_name])

    return (
        <>
            {/* ====================== INLINE HEADER ====================== */}
            <header className="fixed top-0 left-0 right-0 z-50 w-full">
                <div className="hidden bg-gradient-to-r from-gray-100 to-teal-50 py-2 text-sm md:block">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-12">
                        <span className="font-medium text-gray-700">{profile.email}</span>
                        <div className="flex items-center gap-4 text-gray-700">
                            <a href="/login" className="font-medium hover:text-teal-600">Log In</a>
                            <span className="text-gray-400">|</span>
                            <span className="font-medium">{profile.phone || "(555) 123-4567"}</span>
                        </div>
                    </div>
                </div>

                <nav className={`bg-white transition-shadow ${isScrolled ? "shadow-lg" : "shadow-sm"}`}>
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
                        <a href="/" className="text-2xl font-bold" style={{ color: primaryColor }}>
                            FinTechful
                        </a>

                        <div className="hidden md:flex items-center gap-8">
                            <a href="#home" className="text-base font-medium text-gray-700 hover:text-teal-600">Home</a>
                            <a href="#for-businesses" className="text-base font-medium text-gray-700 hover:text-teal-600">For Businesses</a>
                            <a href="#for-consumers" className="text-base font-medium text-gray-700 hover:text-teal-600">For Consumers</a>
                            <a href="#resources" className="text-base font-medium text-gray-700 hover:text-teal-600">Resources</a>
                            <a href="#about" className="text-base font-medium text-gray-700 hover:text-teal-600">About Me</a>
                        </div>

                        <Button style={{ backgroundColor: primaryColor }} className="hidden md:block h-11 text-base hover:opacity-90">
                            Book a Call
                        </Button>

                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>

                    {isMenuOpen && (
                        <div className="border-t bg-white px-6 py-4 md:hidden">
                            <div className="flex flex-col gap-4">
                                <a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
                                <a href="#for-businesses" onClick={() => setIsMenuOpen(false)}>For Businesses</a>
                                <a href="#for-consumers" onClick={() => setIsMenuOpen(false)}>For Consumers</a>
                                <a href="#resources" onClick={() => setIsMenuOpen(false)}>Resources</a>
                                <a href="#about" onClick={() => setIsMenuOpen(false)}>About Me</a>
                                <div className="border-t pt-4">
                                    <div className="mb-3">{profile.email}</div>
                                    <Button style={{ backgroundColor: primaryColor }} className="w-full">
                                        Book a Call
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </nav>
            </header>

            {/* ====================== MAIN BODY (full v0 with dynamic replacements) ====================== */}
            <main className="relative min-h-[85vh] w-full overflow-hidden bg-white pt-24 md:pt-28">
                {/* Full v0 main content — pasted with dynamic changes */}
                {/* Hero */}
                <div className="relative mx-auto grid min-h-[85vh] max-w-7xl grid-cols-1 items-center gap-12 px-6 py-12 lg:grid-cols-2 lg:gap-16 lg:px-12">
                    <div ref={imageRef} className="opacity-0 transition-all duration-1000 ease-out">
                        <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-full shadow-2xl ring-4 ring-teal-100 lg:max-w-lg">
                            <img
                                src={profile.avatar_url || "/professional-financial-advisor-smiling-headshot-po.jpg"}
                                alt={profile.full_name}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-gold-500/10" />
                        </div>
                    </div>

                    <div ref={contentRef} className="opacity-0 space-y-6 transition-all duration-1000 delay-200 ease-out">
                        <div className="space-y-4">
                            <h1 className="text-balance text-5xl font-bold leading-tight tracking-tight text-gray-900 lg:text-6xl">
                                Hi, I'm {profile.full_name} – Your Partner in Building
                                <span className="relative inline-block text-teal-600">
                                    {headlines.map((headline, idx) => (
                                        <span
                                            key={idx}
                                            className={`absolute left-0 top-0 transition-opacity duration-700 ${idx === currentHeadline ? "opacity-100" : "opacity-0"}`}
                                        >
                                            {headline}
                                        </span>
                                    ))}
                                    <span className="invisible">{headlines[0]}</span>
                                </span>
                            </h1>

                            <p className="text-pretty text-xl leading-relaxed text-gray-700 lg:text-2xl">
                                Take control today. Access free leads, world-class growth tools, and funding that turns ambition into reality.
                            </p>

                            <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-gold-700 drop-shadow-sm">
                                Opportunities like this don't wait — let's make it happen.
                            </p>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <Button style={{ backgroundColor: primaryColor }} size="lg" className="group h-14 px-8 text-lg font-semibold text-white shadow-lg hover:opacity-90">
                                For Business Owners: Get Started Now
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 border-2 border-teal-600 px-8 text-lg font-semibold text-teal-600 hover:bg-teal-50">
                                For Individuals: Explore Options
                            </Button>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-6 pt-4">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                                <span className="text-sm font-medium text-gray-600">Free Consultation</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-gold-600" />
                                <span className="text-sm font-medium text-gray-600">Trusted by 500+ Clients</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                                <span className="text-sm font-medium text-gray-600">Same-Day Response</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div className="wave-divider bg-gradient-to-r from-teal-50/50 via-gray-50/30 to-teal-50/50"></div>

            <section
                ref={businessRef}
                className="opacity-0 w-full bg-white py-20 transition-all duration-1000 ease-out lg:py-28"
            >
                <div className="mx-auto max-w-7xl px-6 lg:px-12">
                    <div className="mb-16 text-center">
                        <h2 className="text-balance mb-4 text-5xl font-extrabold tracking-tight text-gray-900 lg:text-6xl font-[family-name:var(--font-display)]">
                            Grow Your Business <span className="text-teal-600">Plentifully</span> — Starting Today
                        </h2>
                        <p className="text-pretty mx-auto max-w-3xl text-xl leading-relaxed text-gray-700 font-medium">
                            Don't wait for growth. Make it happen with these powerful solutions.
                        </p>
                    </div>

                    <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="group flex flex-col rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:border-gold-500 hover:shadow-2xl hover:shadow-gold-500/30 hover:scale-105 animate-fade-in-stagger-1">
                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-teal-200">
                                <Users className="h-10 w-10 text-teal-600" />
                            </div>
                            <h3 className="mb-3 text-2xl font-bold text-gray-900 font-[family-name:var(--font-display)]">
                                Free Qualified Leads (LeadFlow)
                            </h3>
                            <p className="mb-6 flex-grow text-base leading-relaxed text-gray-600">
                                Get high-intent leads in home services delivered straight to you. Just create your free account and add
                                your business info. No cost, no catch.
                            </p>
                            <Button
                                size="lg"
                                className="h-12 w-full bg-teal-600 text-base font-semibold text-white transition-all hover:bg-teal-700 hover:-translate-y-1 hover:shadow-lg"
                            >
                                Claim Free Leads Now
                            </Button>
                        </div>

                        <div className="group flex flex-col rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:border-gold-500 hover:shadow-2xl hover:shadow-gold-500/30 hover:scale-105 animate-fade-in-stagger-2">
                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-teal-200">
                                <Rocket className="h-10 w-10 text-teal-600" />
                            </div>
                            <h3 className="mb-3 text-2xl font-bold text-gray-900 font-[family-name:var(--font-display)]">
                                Complete Digital Growth Bundle (GrowEasy Pro/Elite)
                            </h3>
                            <p className="mb-6 flex-grow text-base leading-relaxed text-gray-600">
                                Custom GHL CRM, AI-powered tools, professional websites, landing pages, ad management, and ongoing
                                support — tailored to your niche for maximum performance.
                            </p>
                            <Button
                                size="lg"
                                className="h-12 w-full bg-teal-600 text-base font-semibold text-white transition-all hover:bg-teal-700 hover:-translate-y-1 hover:shadow-lg"
                            >
                                See GrowEasy Plans
                            </Button>
                        </div>

                        <div className="group flex flex-col rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:border-gold-500 hover:shadow-2xl hover:shadow-gold-500/30 hover:scale-105 animate-fade-in-stagger-3">
                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-teal-200">
                                <DollarSign className="h-10 w-10 text-teal-600" />
                            </div>
                            <h3 className="mb-3 text-2xl font-bold text-gray-900 font-[family-name:var(--font-display)]">
                                Fuel Rapid Growth (Financial Services)
                            </h3>
                            <p className="mb-6 flex-grow text-base leading-relaxed text-gray-600">
                                World-class funding, loans, POS financing, and more through trusted partners like Lendflow. Get the
                                capital you need to scale fast.
                            </p>
                            <Button
                                size="lg"
                                className="h-12 w-full bg-teal-600 text-base font-semibold text-white transition-all hover:bg-teal-700 hover:-translate-y-1 hover:shadow-lg"
                            >
                                Apply for Funding
                            </Button>
                        </div>
                    </div>

                    <div className="text-center">
                        <Button
                            size="lg"
                            className="h-16 bg-teal-600 px-12 text-xl font-bold text-white shadow-xl transition-all hover:bg-teal-700 hover:shadow-2xl hover:-translate-y-1 font-[family-name:var(--font-display)]"
                        >
                            Book Your Free Strategy Call
                        </Button>
                    </div>
                </div>
            </section>

            <div className="wave-divider bg-white"></div>

            <section
                ref={consumerRef}
                className="opacity-0 w-full bg-gradient-to-br from-gray-50 to-teal-50/30 py-20 transition-all duration-1000 ease-out lg:py-24"
            >
                <div className="mx-auto max-w-6xl px-6 lg:px-12">
                    <div className="mb-12 text-center">
                        <h2 className="text-balance mb-3 text-4xl font-extrabold tracking-tight text-gray-900 lg:text-5xl font-[family-name:var(--font-display)]">
                            Build the Personal Future You Deserve
                        </h2>
                        <p className="text-pretty mx-auto max-w-2xl text-lg leading-relaxed text-gray-700 font-medium">
                            Smart financial options and resources to make progress now.
                        </p>
                    </div>

                    <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="group flex flex-col rounded-xl border-2 border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:border-gold-500 hover:shadow-xl hover:shadow-gold-500/20 hover:scale-105 animate-fade-in-stagger-1">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-teal-200">
                                <CreditCard className="h-7 w-7 text-teal-600" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-gray-900 font-[family-name:var(--font-display)]">
                                Financial Solutions
                            </h3>
                            <p className="text-sm leading-relaxed text-gray-600">
                                Personal loans, insurance, credit cards, refinancing, high-yield savings, and debt relief options
                                tailored to your needs.
                            </p>
                        </div>

                        <div className="group flex flex-col rounded-xl border-2 border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:border-gold-500 hover:shadow-xl hover:shadow-gold-500/20 hover:scale-105 animate-fade-in-stagger-2">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold-100 to-gold-200">
                                <Calculator className="h-7 w-7 text-gold-700" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-gray-900 font-[family-name:var(--font-display)]">
                                Tools & Resources
                            </h3>
                            <p className="text-sm leading-relaxed text-gray-600">
                                Helpful calculators, educational articles, and financial planners to help you make informed decisions
                                and reach your goals.
                            </p>
                        </div>

                        <div className="group flex flex-col rounded-xl border-2 border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:border-gold-500 hover:shadow-xl hover:shadow-gold-500/20 hover:scale-105 animate-fade-in-stagger-3">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-teal-200">
                                <MapPin className="h-7 w-7 text-teal-600" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-gray-900 font-[family-name:var(--font-display)]">
                                Connect with Pros
                            </h3>
                            <p className="text-sm leading-relaxed text-gray-600">
                                Access local professionals via LeadFlow estimates and exclusive SparkFlow discounts on services you
                                need.
                            </p>
                        </div>
                    </div>

                    <div className="text-center">
                        <Button
                            size="lg"
                            className="h-14 bg-teal-600 px-10 text-lg font-semibold text-white shadow-lg transition-all hover:bg-teal-700 hover:shadow-xl hover:-translate-y-1"
                        >
                            Get Personalized Recommendations
                        </Button>
                    </div>
                </div>
            </section>

            <div className="wave-divider bg-gradient-to-br from-gray-50 to-teal-50/30"></div>

            <section
                ref={resourcesRef}
                className="opacity-0 w-full bg-gray-900 py-20 transition-all duration-1000 ease-out lg:py-28"
            >
                <div className="mx-auto max-w-7xl px-6 lg:px-12">
                    <div className="mb-16 text-center">
                        <h2 className="text-balance mb-4 text-5xl font-extrabold tracking-tight text-white lg:text-6xl font-[family-name:var(--font-display)]">
                            Latest Insights to Stay Ahead
                        </h2>
                        <p className="text-pretty mx-auto max-w-3xl text-xl leading-relaxed text-gray-300 font-medium">
                            Expert guidance and actionable strategies for your financial journey.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                        <div className="group flex flex-col overflow-hidden rounded-xl border-2 border-gray-700 bg-gray-800 shadow-xl transition-all duration-300 hover:border-gold-500 hover:shadow-2xl hover:shadow-gold-500/30 hover:-translate-y-2 animate-fade-in-stagger-1">
                            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-teal-600 to-teal-800">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <BookOpen className="h-16 w-16 text-white/40" />
                                </div>
                            </div>
                            <div className="flex flex-col p-6">
                                <h3 className="mb-2 text-lg font-bold text-white font-[family-name:var(--font-display)]">
                                    5 Ways to Maximize Business Credit
                                </h3>
                                <p className="mb-4 text-sm leading-relaxed text-gray-400">
                                    Learn proven strategies to build and leverage your business credit for maximum growth potential.
                                </p>
                                <button className="mt-auto text-sm font-semibold text-gold-400 transition-colors hover:text-gold-300">
                                    Read More →
                                </button>
                            </div>
                        </div>

                        <div className="group flex flex-col overflow-hidden rounded-xl border-2 border-gray-700 bg-gray-800 shadow-xl transition-all duration-300 hover:border-gold-500 hover:shadow-2xl hover:shadow-gold-500/30 hover:-translate-y-2 animate-fade-in-stagger-2">
                            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gold-600 to-gold-800">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <BookOpen className="h-16 w-16 text-white/40" />
                                </div>
                            </div>
                            <div className="flex flex-col p-6">
                                <h3 className="mb-2 text-lg font-bold text-white font-[family-name:var(--font-display)]">
                                    Understanding Small Business Loans
                                </h3>
                                <p className="mb-4 text-sm leading-relaxed text-gray-400">
                                    A comprehensive guide to finding and securing the right financing for your business needs.
                                </p>
                                <button className="mt-auto text-sm font-semibold text-gold-400 transition-colors hover:text-gold-300">
                                    Read More →
                                </button>
                            </div>
                        </div>

                        <div className="group flex flex-col overflow-hidden rounded-xl border-2 border-gray-700 bg-gray-800 shadow-xl transition-all duration-300 hover:border-gold-500 hover:shadow-2xl hover:shadow-gold-500/30 hover:-translate-y-2 animate-fade-in-stagger-3">
                            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-teal-700 to-blue-800">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <BookOpen className="h-16 w-16 text-white/40" />
                                </div>
                            </div>
                            <div className="flex flex-col p-6">
                                <h3 className="mb-2 text-lg font-bold text-white font-[family-name:var(--font-display)]">
                                    Digital Marketing ROI Calculator
                                </h3>
                                <p className="mb-4 text-sm leading-relaxed text-gray-400">
                                    Discover how to measure and maximize the return on your marketing investments with our tools.
                                </p>
                                <button className="mt-auto text-sm font-semibold text-gold-400 transition-colors hover:text-gold-300">
                                    Read More →
                                </button>
                            </div>
                        </div>

                        <div className="group flex flex-col overflow-hidden rounded-xl border-2 border-gray-700 bg-gray-800 shadow-xl transition-all duration-300 hover:border-gold-500 hover:shadow-2xl hover:shadow-gold-500/30 hover:-translate-y-2 animate-fade-in-stagger-4">
                            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-teal-600 to-gold-700">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <BookOpen className="h-16 w-16 text-white/40" />
                                </div>
                            </div>
                            <div className="flex flex-col p-6">
                                <h3 className="mb-2 text-lg font-bold text-white font-[family-name:var(--font-display)]">
                                    Lead Generation Best Practices
                                </h3>
                                <p className="mb-4 text-sm leading-relaxed text-gray-400">
                                    Master the art of attracting and converting high-quality leads in today's competitive market.
                                </p>
                                <button className="mt-auto text-sm font-semibold text-gold-400 transition-colors hover:text-gold-300">
                                    Read More →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="wave-divider bg-gray-900"></div>

            <section
                ref={aboutRef}
                className="opacity-0 w-full bg-white py-20 transition-all duration-1000 ease-out lg:py-28"
            >
                <div className="mx-auto max-w-6xl px-6 lg:px-12">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
                        <div className="order-2 lg:order-1">
                            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl ring-4 ring-teal-100">
                                <img
                                    src={profile.avatar_url || "/professional-financial-advisor-smiling-headshot-po.jpg"}
                                    alt={`${profile.full_name} - Financial Advisor`}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/20 to-transparent" />
                            </div>
                        </div>

                        <div className="order-1 space-y-6 lg:order-2">
                            <div className="flex items-center gap-3">
                                <User className="h-10 w-10 text-teal-600" />
                                <h2 className="text-5xl font-extrabold tracking-tight text-gray-900 lg:text-6xl">
                                    About {profile.full_name}
                                </h2>
                            </div>

                            <div className="space-y-4 text-base leading-relaxed text-gray-700">
                                <p className="font-medium">
                                    {profile.bio || "With years of experience in financial services, I've helped hundreds of business owners and individuals unlock opportunities they didn't know existed..."}
                                </p>

                                <p className="text-lg font-bold text-teal-700 italic">
                                    "I'm here to help you seize opportunities others miss. Let's build something abundant together —
                                    starting right now."
                                </p>
                            </div>

                            <Button
                                size="lg"
                                className="h-14 bg-teal-600 px-10 text-lg font-semibold text-white shadow-lg transition-all hover:bg-teal-700 hover:shadow-xl hover:-translate-y-1"
                            >
                                <Mail className="mr-2 h-5 w-5" />
                                Get in Touch
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="wave-divider bg-white"></div>

            <section
                ref={bannerRef}
                className="opacity-0 w-full bg-gradient-to-r from-teal-50/50 via-gray-50/30 to-teal-50/50 py-12 transition-all duration-1000 ease-out"
            >
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 lg:flex-row lg:px-12">
                    <p className="text-balance text-center text-lg leading-relaxed text-gray-800 lg:text-left lg:text-xl">
                        Love this professional site? Claim your own branded subdomain instantly as a{" "}
                        <span className="font-semibold text-teal-700">FinTechful Founding Agent</span>. Earn recurring commissions,
                        overrides, and build your network before everyone else jumps in.
                    </p>
                    <Button
                        size="lg"
                        className="h-14 shrink-0 bg-teal-600 px-8 text-lg font-semibold text-white shadow-lg transition-all hover:bg-teal-700 hover:shadow-xl hover:-translate-y-0.5"
                    >
                        Join Now
                    </Button>
                </div>
            </section>

            <div className="wave-divider bg-white"></div>

            <section
                ref={finalCtaRef}
                className="opacity-0 w-full bg-gray-900 py-20 transition-all duration-1000 ease-out lg:py-28"
            >
                <div className="mx-auto max-w-5xl px-6 lg:px-12">
                    <div className="mb-12 text-center">
                        <h2 className="text-balance mb-4 text-5xl font-extrabold tracking-tight text-white lg:text-6xl font-[family-name:var(--font-display)]">
                            Ready to Make It Happen?
                        </h2>
                        <p className="text-pretty mx-auto max-w-3xl text-xl leading-relaxed text-gray-200 font-medium">
                            Book your strategy call now and take the first step toward building plentiful growth.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* GHL Calendar Embed Placeholder */}
                        <div className="rounded-2xl border-2 border-gold-500 bg-white/95 p-8 shadow-2xl">
                            <div className="flex min-h-[400px] items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-gold-50">
                                <div className="text-center">
                                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-teal-600">
                                        <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-xl font-bold text-gray-900 font-[family-name:var(--font-display)]">
                                        GHL Calendar Embed
                                    </p>
                                    <p className="mt-2 text-sm text-gray-600">Placeholder for GoHighLevel calendar integration</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form Placeholder */}
                        <div className="rounded-2xl border-2 border-gold-500 bg-white/95 p-8 shadow-2xl">
                            <h3 className="mb-6 text-center text-2xl font-bold text-gray-900 font-[family-name:var(--font-display)]">
                                Or Send Me a Message
                            </h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors focus:border-teal-600 focus:outline-none"
                                />
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors focus:border-teal-600 focus:outline-none"
                                />
                                <textarea
                                    rows={4}
                                    placeholder="Tell me about your goals..."
                                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors focus:border-teal-600 focus:outline-none"
                                />
                                <Button
                                    size="lg"
                                    className="h-14 w-full bg-teal-600 text-lg font-semibold text-white shadow-lg transition-all hover:bg-teal-700 hover:shadow-xl hover:-translate-y-1"
                                >
                                    Send Message
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-xl bg-gold-500/20 p-6 text-center backdrop-blur-sm">
                            <p className="text-lg font-bold text-gray-200 font-[family-name:var(--font-display)]">
                                ⚡ Spots for founding agents are filling fast. Don't wait — book your call today.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/* Conditional sections */}



            {/* ====================== INLINE FOOTER ====================== */}
            <footer className="w-full border-t border-gray-200 bg-gray-50 py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-12">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
                        {/* Contact Info */}
                        <div className="space-y-4 lg:col-span-2">
                            <div className="mb-6">
                                <h3 className="text-2xl font-extrabold text-teal-600 font-[family-name:var(--font-display)]">
                                    FinTechful
                                </h3>
                                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                    Building plentiful financial futures for businesses and individuals.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <a
                                    href="mailto:{profile.email}"
                                    className="flex items-center gap-2 text-gray-600 transition-colors hover:text-teal-600"
                                >
                                    <Mail className="h-5 w-5" />
                                    <span className="text-sm font-medium">{profile.email}</span>
                                </a>
                                <a
                                    href="tel:+15551234567"
                                    className="flex items-center gap-2 text-gray-600 transition-colors hover:text-teal-600"
                                >
                                    <Phone className="h-5 w-5" />
                                    <span className="text-sm font-medium">{profile.phone}</span>
                                </a>
                            </div>

                            {/* Social Links */}
                            <div className="flex gap-3 pt-4">
                                <a
                                    href="#linkedin"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-600 transition-all hover:bg-teal-600 hover:text-white hover:scale-110"
                                    aria-label="LinkedIn"
                                >
                                    <Linkedin className="h-5 w-5" />
                                </a>
                                <a
                                    href="#twitter"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-600 transition-all hover:bg-teal-600 hover:text-white hover:scale-110"
                                    aria-label="Twitter"
                                >
                                    <Twitter className="h-5 w-5" />
                                </a>
                                <a
                                    href="#facebook"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-600 transition-all hover:bg-teal-600 hover:text-white hover:scale-110"
                                    aria-label="Facebook"
                                >
                                    <Facebook className="h-5 w-5" />
                                </a>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-gray-900 font-[family-name:var(--font-display)]">For Business</h4>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#funding"
                                        className="text-sm text-gray-600 transition-colors hover:text-teal-600 hover:underline"
                                    >
                                        Business Funding
                                    </a>
                                </li>
                                <li>
                                    <a href="#pos" className="text-sm text-gray-600 transition-colors hover:text-teal-600 hover:underline">
                                        POS Financing
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#leadflow"
                                        className="text-sm text-gray-600 transition-colors hover:text-teal-600 hover:underline"
                                    >
                                        LeadFlow
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#groweasy"
                                        className="text-sm text-gray-600 transition-colors hover:text-teal-600 hover:underline"
                                    >
                                        GrowEasy
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-gray-900 font-[family-name:var(--font-display)]">For Consumers</h4>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#personal-loans"
                                        className="text-sm text-gray-600 transition-colors hover:text-teal-600 hover:underline"
                                    >
                                        Personal Loans
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#insurance"
                                        className="text-sm text-gray-600 transition-colors hover:text-teal-600 hover:underline"
                                    >
                                        Insurance
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#auto-refi"
                                        className="text-sm text-gray-600 transition-colors hover:text-teal-600 hover:underline"
                                    >
                                        Auto Refi
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#student-loan"
                                        className="text-sm text-gray-600 transition-colors hover:text-teal-600 hover:underline"
                                    >
                                        Student Loan Refi
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#debt-relief"
                                        className="text-sm text-gray-600 transition-colors hover:text-teal-600 hover:underline"
                                    >
                                        Debt Relief
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-start justify-start lg:justify-end">
                            <div className="inline-flex flex-col items-center gap-2 rounded-xl border-4 border-teal-600 bg-gradient-to-br from-teal-50 to-gold-50 px-6 py-4 shadow-lg">
                                <div className="text-center">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Powered by</p>
                                    <p className="text-2xl font-extrabold text-teal-700 font-[family-name:var(--font-display)]">
                                        FinTechful
                                    </p>
                                </div>
                                <div className="h-1 w-full rounded-full bg-gradient-to-r from-teal-600 to-gold-500"></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 border-t border-gray-300 pt-8 text-center">
                        <p className="text-sm text-gray-600">
                            © {new Date().getFullYear()} FinTechful. All rights reserved. | Building plentiful futures together.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    )
}