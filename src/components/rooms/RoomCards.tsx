import { Wifi, Coffee, Tv, Bath } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { MappedRoom } from '../../types/room';
import { images } from '../../config/images';

const roomTypes: MappedRoom[] = [
  {
    roomTypeId: 'studio',
    websiteRoomId: 'studio',
    name: 'Studio Apartment',
    description: 'Modern studio apartment with kitchenette, perfect for solo travelers or couples',
    image: images.rooms.studio,
    availability: 5,
    maxOccupancy: {
      adults: 2,
      children: 1
    },
    rates: [{
      rateTypeId: 'standard',
      baseRate: 11158,
      extraAdultRate: 2000,
      extraChildRate: 1000
    }],
    amenities: [
      { icon: <Wifi className="w-5 h-5" />, label: 'Wi-Fi' },
      { icon: <Coffee className="w-5 h-5" />, label: 'Kitchenette' },
      { icon: <Tv className="w-5 h-5" />, label: 'Smart TV' },
      { icon: <Bath className="w-5 h-5" />, label: 'En-suite' }
    ]
  },
  {
    roomTypeId: 'one-bedroom',
    websiteRoomId: 'one-bedroom',
    name: 'One Bedroom Apartment',
    description: 'Spacious apartment with separate bedroom and full kitchen, ideal for extended stays',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
    availability: 3,
    maxOccupancy: {
      adults: 3,
      children: 2
    },
    rates: [{
      rateTypeId: 'standard',
      baseRate: 14258,
      extraAdultRate: 2500,
      extraChildRate: 1250
    }],
    amenities: [
      { icon: <Wifi className="w-5 h-5" />, label: 'Wi-Fi' },
      { icon: <Coffee className="w-5 h-5" />, label: 'Full Kitchen' },
      { icon: <Tv className="w-5 h-5" />, label: 'Smart TV' },
      { icon: <Bath className="w-5 h-5" />, label: 'En-suite' }
    ]
  },
  {
    roomTypeId: 'two-bedroom',
    websiteRoomId: 'two-bedroom',
    name: 'Two Bedroom Apartment',
    description: 'Luxurious two bedroom apartment with full kitchen and living area, perfect for families',
    image: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    availability: 2,
    maxOccupancy: {
      adults: 4,
      children: 3
    },
    rates: [{
      rateTypeId: 'standard',
      baseRate: 17991,
      extraAdultRate: 3000,
      extraChildRate: 1500
    }],
    amenities: [
      { icon: <Wifi className="w-5 h-5" />, label: 'Wi-Fi' },
      { icon: <Coffee className="w-5 h-5" />, label: 'Full Kitchen' },
      { icon: <Tv className="w-5 h-5" />, label: 'Smart TV' },
      { icon: <Bath className="w-5 h-5" />, label: 'Two En-suites' }
    ]
  }
];

export default function RoomCards() {
  const { setStep, setIsBookingOpen, setSelectedRoom } = useBooking();

  const handleBookNow = (room: MappedRoom) => {
    setSelectedRoom(room);
    setStep(1); // Reset to first step
    setIsBookingOpen(true); // Open the booking modal
  };

  return (
    <div className="py-16">
      <h2 className="text-4xl font-serif text-center font-bold mb-12">Our Luxury Apartments</h2>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {roomTypes.map((room) => (
          <div key={room.roomTypeId} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <img 
                src={room.image} 
                alt={room.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6 space-y-4">
              <h3 className="text-2xl font-bold">{room.name}</h3>
              <p className="text-gray-600">{room.description}</p>
              
              <div className="flex gap-4">
                {room.amenities.map((amenity, index) => (
                  <div key={index} className="text-gray-500" title={amenity.label}>
                    {amenity.icon}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-amber-600 font-bold">
                  <span className="text-sm">From </span>
                  <span className="text-xl">KES {room.rates[0].baseRate.toLocaleString()}</span>
                  <span className="text-sm">/night</span>
                </div>
                
                <button 
                  onClick={() => handleBookNow(room)}
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