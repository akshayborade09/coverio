import LandscapeMessage from '@/components/LandscapeMessage'

export default function TestLandscapePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Orientation Message Test
        </h1>
        <p className="text-gray-600 mb-4">
          This page is for testing the orientation and device messages.
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>• <strong>Desktop:</strong> Should show "Open on Mobile" message</p>
          <p>• <strong>Mobile Portrait:</strong> No message should appear</p>
          <p>• <strong>Mobile Landscape:</strong> Should show "Rotate Device" message</p>
          <p>• <strong>Test Mode:</strong> Add ?test=landscape or ?test=desktop to URL</p>
          <p>• Check browser console for debugging info</p>
        </div>
      </div>
      <LandscapeMessage />
    </div>
  )
} 