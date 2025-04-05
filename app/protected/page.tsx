import GetQuoteButton from "@/components/GetQuoteButton";

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome!</h1>
        <p className="text-gray-600 mb-6">
          We're glad to have you here. This is your protected dashboard area.
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded">
            <h2 className="text-xl font-semibold text-gray-700">
              Getting Started
            </h2>
            <p className="text-gray-600 mt-2">
              Explore your dashboard and discover all the features available to
              you.
            </p>
          </div>
          <GetQuoteButton />
        </div>
      </div>
    </div>
  );
}
