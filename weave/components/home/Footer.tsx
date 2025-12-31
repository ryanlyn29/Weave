import Link from 'next/link'

export function Footer() {
  return (
    <footer className="px-6 py-12 bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-sm font-medium text-white mb-3">About</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="#" className="hover:text-white">How it works</Link></li>
              <li><Link href="#" className="hover:text-white">Pricing</Link></li>
              <li><Link href="#" className="hover:text-white">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-white mb-3">Privacy</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white">Data Security</Link></li>
              <li><Link href="#" className="hover:text-white">Encryption</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-white mb-3">Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white">Cookie Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-white mb-3">Data Philosophy</h4>
            <p className="text-xs text-gray-400">
              Your data stays private. No ads, no public feeds. 
              WEAVE is built for high-trust groups only.
            </p>
          </div>
        </div>
        <div className="hairline-t border-gray-800 pt-6 text-xs text-gray-500 text-center">
          © 2024 WEAVE. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

