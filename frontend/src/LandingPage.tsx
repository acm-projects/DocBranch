export default function LandingPage() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-200 p-4">
        <h2 className="text-xl font-bold mb-6">Sidebar</h2>
        {/* Add sidebar content here */}
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 space-y-6">
        {/* Left aligned text */}
        <div>
          <h1 className="text-3xl font-bold text-left">Hello, User</h1>
          <p className="text-left text-gray-600 mt-2 max-w-md">
            This is some introductory text aligned to the left.
          </p>
        </div>

        {/* Search bar below */}
        <div>
          <input
            type="text"
            placeholder="Search..."
            className="w-full max-w-sm px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Container with 3 boxes */}
        <div className="flex gap-4 max-w-md">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="flex-1 bg-blue-100 p-4 rounded-md text-center font-semibold"
            >
              Box {n}
            </div>
          ))}
        </div>

        {/* Two buttons arranged horizontally with text + images */}
        <div className="flex gap-6 max-w-md">
          <button className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700">
            <img
              src="https://img.icons8.com/ios-filled/24/ffffff/search.png"
              alt="Search Icon"
              className="w-5 h-5"
            />
            Search
          </button>
          <button className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700">
            <img
              src="https://img.icons8.com/ios-filled/24/ffffff/user.png"
              alt="User Icon"
              className="w-5 h-5"
            />
            Profile
          </button>
        </div>
      </main>
    </div>
  );
}
