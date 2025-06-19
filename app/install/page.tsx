import { FavorLogo } from "@/components/favor-logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function InstallPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <FavorLogo size="lg" showText={false} />
        <h1 className="text-3xl font-bold mt-6 mb-2">Install Favor</h1>
        <p className="text-gray-400 mb-8">Exchange services with others in a secure environment</p>

        <div className="w-full max-w-md bg-gray-900 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">How to Install</h2>

          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-medium mb-2">iOS Installation</h3>
              <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                <li>Open this page in Safari</li>
                <li>Tap the share icon at the bottom of the screen</li>
                <li>Scroll down and tap "Add to Home Screen"</li>
                <li>Tap "Add" in the top right corner</li>
              </ol>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-medium mb-2">Android Installation</h3>
              <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                <li>Open this page in Chrome</li>
                <li>Tap the menu icon (three dots) in the top right</li>
                <li>Tap "Add to Home screen"</li>
                <li>Tap "Add" when prompted</li>
              </ol>
            </div>
          </div>
        </div>

        <Button asChild size="lg" className="w-full max-w-md rounded-full">
          <Link href="/">Continue to App</Link>
        </Button>
      </div>

      <footer className="py-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Favor. All rights reserved.</p>
      </footer>
    </div>
  )
}
