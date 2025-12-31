export function ValueGrid() {
  const values = [
    {
      title: 'Remembering',
      description: 'Every plan, decision, and promise is automatically extracted and tracked',
      example: 'Saturday coffee meeting → Saved as Plan with date, time, participants',
      preview: (
        <div className="bg-white rounded-xl border border-gray-200 p-3 mt-3">
          <div className="text-xs text-gray-500 mb-1">Plan</div>
          <div className="text-sm font-medium">Coffee Meeting</div>
          <div className="text-xs text-gray-600 mt-1">Sat, Jan 20 • 2:00 PM</div>
        </div>
      ),
    },
    {
      title: 'Resolving',
      description: 'Track the lifecycle of every entity from proposal to completion',
      example: 'Promise to bring notes → Status: Pending → Mark as Done',
      preview: (
        <div className="bg-white rounded-xl border border-gray-200 p-3 mt-3">
          <div className="text-xs text-gray-500 mb-1">Promise</div>
          <div className="text-sm font-medium">Bring notes</div>
          <div className="text-xs text-blue-600 mt-1">Status: Pending</div>
        </div>
      ),
    },
    {
      title: 'Recalling',
      description: 'Search by intent, not keywords. Find what you need when you need it',
      example: 'Search "when did we decide on colors?" → Finds decision with context',
      preview: (
        <div className="bg-white rounded-xl border border-gray-200 p-3 mt-3">
          <div className="text-xs text-gray-500 mb-1">Search Result</div>
          <div className="text-sm font-medium">Color scheme decision</div>
          <div className="text-xs text-gray-600 mt-1">Found in: Team Review thread</div>
        </div>
      ),
    },
  ]

  return (
    <section className="px-6 py-16 bg-gray-50 border-b border-gray-200">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-medium text-gray-900 mb-12 text-center">
          How WEAVE Works
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((value, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">{value.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{value.description}</p>
              <div className="text-xs text-gray-500 mb-3 italic">{value.example}</div>
              {value.preview}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
