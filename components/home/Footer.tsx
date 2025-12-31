import Link from 'next/link'

export function Footer() {
  return (
    <footer className="px-6 py-12 bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">About</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><Link href="#how-it-works" className="hover:text-gray-900 transition-colors">How it works</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Privacy</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><Link href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition-colors">Data Security</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition-colors">Encryption</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Legal</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><Link href="#" className="hover:text-gray-900 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Data Philosophy</h4>
            <p className="text-xs text-gray-600">
              Your data stays private. No ads, no public feeds. 
              WEAVE is built for high-trust groups only.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-6 text-xs text-gray-500 text-center">
          © 2024 WEAVE. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
