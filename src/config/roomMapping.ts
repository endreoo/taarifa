import { MappedRoom } from '../types/room';

export interface RoomMapping {
  ezeeRoomTypeId: string[];
  websiteRoomId: string;
  name: string;
  description: string;
  image: string;
  maxOccupancy: {
    adults: number;
    children: number;
  };
}

export const roomMappings: RoomMapping[] = [
  {
    ezeeRoomTypeId: [
      '1826200000000000001',
      '1826200000000000002',
      '1826200000000000003',
      '1826200000000000004'
    ],
    websiteRoomId: 'studio',
    name: 'Studio Apartment',
    description: 'Modern studio apartment with kitchenette. Various layouts available including balcony options.',
    image: '/images/rooms/studio.jpg',
    maxOccupancy: { adults: 2, children: 1 }
  },
  {
    ezeeRoomTypeId: ['1826200000000000005'],
    websiteRoomId: 'one-bedroom',
    name: 'One Bedroom Apartment',
    description: 'Spacious one bedroom apartment with separate living area and full kitchen',
    image: '/images/rooms/one-bedroom.jpg',
    maxOccupancy: { adults: 2, children: 2 }
  },
  {
    ezeeRoomTypeId: ['1826200000000000006'],
    websiteRoomId: 'two-bedroom',
    name: 'Two Bedroom Apartment',
    description: 'Luxurious two bedroom apartment ideal for families or sharing',
    image: '/images/rooms/two-bedroom.jpg',
    maxOccupancy: { adults: 4, children: 2 }
  }
];

export function getRoomsByCategory(rooms: MappedRoom[]): Record<string, MappedRoom[]> {
  return rooms.reduce((acc, room) => {
    const mapping = roomMappings.find(m => m.ezeeRoomTypeId.includes(room.roomTypeId));
    if (mapping) {
      const category = mapping.name;
      if (!acc[category]) {
        acc[category] = [];
      }
      const existingRoom = acc[category].find(r => r.websiteRoomId === mapping.websiteRoomId);
      if (existingRoom) {
        existingRoom.availability += room.availability;
        existingRoom.rates = [...existingRoom.rates, ...room.rates].reduce((bestRates, rate) => {
          const existing = bestRates.find(r => r.rateTypeId === rate.rateTypeId);
          if (!existing || existing.baseRate > rate.baseRate) {
            return [...bestRates.filter(r => r.rateTypeId !== rate.rateTypeId), rate];
          }
          return bestRates;
        }, [] as typeof room.rates);
      } else {
        acc[category].push({
          ...room,
          websiteRoomId: mapping.websiteRoomId,
          name: mapping.name,
          description: mapping.description,
          image: mapping.image,
          maxOccupancy: mapping.maxOccupancy
        });
      }
    }
    return acc;
  }, {} as Record<string, MappedRoom[]>);
} 