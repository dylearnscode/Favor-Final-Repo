import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FavorLogo } from "./favor-logo"

export function HeroSection() {
  return (
    <section className="py-8 md:py-12 lg:py-20 rounded-lg fade-in">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <FavorLogo size="lg" showText={false} />
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">Exchange Services Securely</h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground text-sm md:text-base lg:text-lg">
              From academic help to professional networking, our platform holds payments until both parties are
              satisfied.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full sm:w-auto">
            <Link href="/services?type=offering" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto font-medium tracking-tight">
                Browse Services
              </Button>
            </Link>
            <Link href="/dashboard/services/new" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto font-medium tracking-tight">
                Request a Service
              </Button>
            </Link>
          </div>
          <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-2">
            <div className="flex overflow-x-auto pb-2 -mx-4 px-4 w-screen md:w-auto md:overflow-visible scrollbar-hide">
              <div className="flex gap-2 md:flex-wrap">
                <Link href="/services?category=academic&type=offering">
                  <Button variant="ghost" size="sm" className="font-medium tracking-tight whitespace-nowrap">
                    Academic
                  </Button>
                </Link>
                <Link href="/services?category=clubs&type=offering">
                  <Button variant="ghost" size="sm" className="font-medium tracking-tight whitespace-nowrap">
                    Clubs
                  </Button>
                </Link>
                <Link href="/services?category=preprofessional&type=offering">
                  <Button variant="ghost" size="sm" className="font-medium tracking-tight whitespace-nowrap">
                    Preprofessional
                  </Button>
                </Link>
                <Link href="/services?category=internship-connect&type=offering">
                  <Button variant="ghost" size="sm" className="font-medium tracking-tight whitespace-nowrap">
                    Internship Connect
                  </Button>
                </Link>
                <Link href="/services?category=social&type=offering">
                  <Button variant="ghost" size="sm" className="font-medium tracking-tight whitespace-nowrap">
                    Social
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
