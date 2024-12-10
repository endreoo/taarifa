import { useEffect, useState } from 'react';
import { EzeeAPI } from '../../services/EzeeAPI';
import { MappedRoom } from '../../types/room';
import { format } from 'date-fns';
import { useBooking } from '../../context/BookingContext';
import { images } from '../../config/images';

interface RoomListProps {
  onSelect: (room: MappedRoom) => void;
}

const roomImages = {
  'Studio Apartment': images.rooms.studio,
  'One Bedroom Apartment': images.rooms.oneBedroom,
  'Two Bedroom Apartment': images.rooms.twoBedroom
};

const roomFeatures = {
  'Studio Apartment': ['Kitchenette', 'Work area', 'Wi-Fi', 'Smart TV'],
  'One Bedroom Apartment': ['Full kitchen', 'Living room', 'Dining', 'Smart TV'],
  'Two Bedroom Apartment': ['2 Bedrooms', 'Kitchen', 'Living room', 'Balcony']
};

export default function RoomList({ onSelect }: RoomListProps) {
  const { checkInDate, checkOutDate, selectedRoom } = useBooking();
  const [rooms, setRooms] = useState<MappedRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const api = new EzeeAPI();
        const checkInStr = format(checkInDate, 'yyyy-MM-dd');
        const checkOutStr = format(checkOutDate, 'yyyy-MM-dd');
        
        const roomData = await api.getRoomInventoryWithDetails(checkInStr, checkOutStr);
        console.log('Fetched room data:', roomData);
        setRooms(roomData);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [checkInDate, checkOutDate]);

  if (loading) return <div className="text-center py-8">Loading available rooms...</div>;
  if (error) return <div className="text-red-600 text-center py-8">Error: {error}</div>;
  if (rooms.length === 0) return <div className="text-center py-8">No rooms available for selected dates</div>;

  return (
    <div className="space-y-3">
      {rooms.map((room) => (
        <div
          key={room.roomTypeId}
          onClick={() => room.availability > 0 ? onSelect(room) : null}
          className={`
            p-4 border rounded-lg transition-colors flex gap-4
            ${selectedRoom?.roomTypeId === room.roomTypeId ? 'border-amber-600 bg-amber-50' : 'border-gray-200 hover:border-amber-300'}
            ${room.availability === 0 ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div className="w-48 h-32 overflow-hidden rounded-lg flex-shrink-0">
            <img
              src={roomImages[room.name as keyof typeof roomImages] || roomImages['Studio Apartment']}
              alt={room.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-grow min-w-0">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold truncate">{room.name}</h3>
                  <p className="text-sm text-gray-500">
                    Max Occupancy: {room.maxOccupancy.adults} Adults
                    {room.maxOccupancy.children > 0 && ` + ${room.maxOccupancy.children} Children`}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg text-amber-600 font-bold whitespace-nowrap">
                    KES {room.rates[0].baseRate.toLocaleString()}
                  </span>
                  <div className="text-sm text-gray-500">per night</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">{room.description}</p>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {roomFeatures[room.name as keyof typeof roomFeatures]?.map((feature, index) => (
                <span key={index} className="text-sm text-gray-600 flex items-center">
                  <span className="mr-1 text-amber-500">•</span>{feature}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center mt-2">
              {room.availability === 0 ? (
                <span className="text-sm font-medium text-red-600">Sold Out</span>
              ) : room.availability < 5 ? (
                <span className="text-sm text-red-600 font-medium">
                  Only {room.availability} left!
                </span>
              ) : (
                <span className="text-sm text-gray-500">Available</span>
              )}
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (room.availability > 0) onSelect(room);
                }}
                disabled={room.availability === 0}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${room.availability === 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-amber-600 text-white hover:bg-amber-700'}
                `}
              >
                Select
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}