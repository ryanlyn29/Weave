import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="bg-white border-b border-gray-200 px-6 py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">
          Chat that remembers everything
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          WEAVE turns everyday conversations into a structured, searchable knowledge base. 
          Key info never gets lost in chat history.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/auth"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700 transition-colors"
          >
            Start
          </Link>
          <Link
            href="#how-it-works"
            className="px-6 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-2xl font-medium hover:bg-gray-50 transition-colors"
          >
            See how it works
          </Link>
        </div>
      </div>
    </section>
  )
}
