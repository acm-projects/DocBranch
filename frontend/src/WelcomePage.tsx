// import React from 'react'

// const About: React.FC = () => {
//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold text-green-600">About Page</h1>
//     </div>
//   )
// }

// export default About

// import React from 'react';

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-100 space-y-6">
      {/* Large centered text */}
      <h1 className="text-5xl font-extrabold text-center">Welcome!</h1>

      {/* Two lines of smaller text */}
      <p className="text-center text-gray-700 max-w-md">
        We're glad to have you here.
      </p>
      <p className="text-center text-gray-700 max-w-md">
        Explore and enjoy our app.
      </p>

      {/* Larger line of text */}
      <p className="text-center text-lg font-semibold max-w-md">
        Let’s get started with some cool features:
      </p>

      {/* 3 horizontal boxes */}
      <div className="flex gap-6">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="w-40 h-24 bg-white rounded-lg shadow flex items-center justify-center font-semibold"
          >
            Feature {n}
          </div>
        ))}
      </div>

      {/* Two buttons below */}
      <div className="flex gap-6">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Get Started
        </button>
        <button className="px-6 py-3 bg-gray-300 rounded-md hover:bg-gray-400">
          Learn More
        </button>
      </div>
    </div>
  );
}
