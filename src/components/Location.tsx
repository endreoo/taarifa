import { MapPin, Phone, Mail } from 'lucide-react';

export default function Location() {
  return (
    <section id="location" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold mb-4">Prime Location</h2>
          <p className="text-gray-600">Located in the heart of Parklands, Nairobi's most prestigious neighborhood</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="text-amber-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">Address</h3>
                  <p className="text-gray-600">Parklands Road, Nairobi, Kenya</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="text-amber-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">Phone</h3>
                  <p className="text-gray-600">+254 (0) 700 000 000</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="text-amber-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">Email</h3>
                  <p className="text-gray-600">reservations@taariifasuites.com</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-bold mb-4">Nearby Attractions</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Westlands Shopping District (5 min)</li>
                <li>• Karura Forest (10 min)</li>
                <li>• UN Complex (15 min)</li>
                <li>• Central Business District (20 min)</li>
              </ul>
            </div>
          </div>

          <div className="h-[400px] bg-gray-200 rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1577739547172-f1edadb28a98?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              alt="Taariifa Suites Location"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}