import { Wifi, Coffee, Tv, Bath } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

const roomTypes = [
  {
    id: 1,
    room_type_name: 'Studio Apartment',
    description: 'Modern studio apartment with kitchenette, perfect for solo travelers or couples',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    number_of_guests: 2,
    breakfast: true,
    internet_included: 'yes',
    parking_included: 'yes',
    lowest_rate: 11158
  },
  {
    id: 2,
    room_type_name: 'One Bedroom Apartment',
    description: 'Spacious apartment with separate bedroom and full kitchen, ideal for extended stays',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
    number_of_guests: 3,
    breakfast: true,
    internet_included: 'yes',
    parking_included: 'yes',
    lowest_rate: 14258
  },
  {
    id: 3,
    room_type_name: 'Two Bedroom Apartment',
    description: 'Luxurious two bedroom apartment with full kitchen and living area, perfect for families',
    image: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    number_of_guests: 4,
    breakfast: true,
    internet_included: 'yes',
    parking_included: 'yes',
    lowest_rate: 17991
  }
];

export default function Suites() {
  const { setStep, setIsBookingOpen } = useBooking();

  const handleBookNow = () => {
    setStep(1);
    setIsBookingOpen(true);
  };

  return (
    <div className="py-16">
      <h2 className="text-4xl font-serif text-center font-bold mb-12">Our Luxury Apartments</h2>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {roomTypes.map((room) => (
          <div key={room.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <img 
                src={room.image}
                alt={room.room_type_name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6 space-y-4">
              <h3 className="text-2xl font-bold">{room.room_type_name}</h3>
              <p className="text-gray-600">{room.description}</p>
              <p className="text-sm text-gray-600">
                Up to {room.number_of_guests} guests
                {room.breakfast && ' • Breakfast included'}
              </p>
              
              <div className="flex gap-4">
                {room.internet_included === 'yes' && (
                  <div className="text-gray-500" title="Free Wi-Fi">
                    <Wifi className="w-5 h-5" />
                  </div>
                )}
                {room.parking_included === 'yes' && (
                  <div className="text-gray-500" title="Free Parking">
                    <Coffee className="w-5 h-5" />
                  </div>
                )}
                <div className="text-gray-500" title="Smart TV">
                  <Tv className="w-5 h-5" />
                </div>
                <div className="text-gray-500" title="En-suite Bathroom">
                  <Bath className="w-5 h-5" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-amber-600 font-bold">
                  <span className="text-sm">From </span>
                  <span className="text-xl">KES {room.lowest_rate.toLocaleString()}</span>
                  <span className="text-sm">/night</span>
                </div>
                
                <button 
                  onClick={handleBookNow}
                  className="px-6 py-2 bg-amber-600 text-white rounded-full font-medium hover:bg-amber-700 transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}