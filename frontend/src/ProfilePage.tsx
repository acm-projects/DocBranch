export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="max-w-lg w-full bg-white rounded-lg shadow p-8">
        <div className="flex flex-col items-center">
          <img
            src="https://i.pravatar.cc/150"
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">John Doe</h2>
          <p className="text-gray-600 mb-6">john.doe@example.com</p>


          <div className="w-full space-y-4 text-left">
            <div>
              <h3 className="font-semibold">About Me</h3>
              <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit amet.</p>
            </div>


            <div>
              <h3 className="font-semibold">Location</h3>
              <p className="text-gray-700">New York, USA</p>
            </div>


            <div>
              <h3 className="font-semibold">Interests</h3>
              <p className="text-gray-700">Photography, Hiking, Coding</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


