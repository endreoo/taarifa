export interface Rate {
  rateTypeId: string;
  baseRate: number;
  extraAdultRate: number;
  extraChildRate: number;
}

export interface Room {
  roomTypeId: string;
  availability: number;
  rates: Rate[];
}

export interface Amenity {
  icon: JSX.Element;
  label: string;
}

export interface MappedRoom extends Room {
  websiteRoomId: string;
  name: string;
  description: string;
  image: string;
  maxOccupancy: {
    adults: number;
    children: number;
  };
  amenities: Amenity[];
}

export interface LowestRoomRate {
  hotelId: string;
  roomTypeId: string;
  lowestRate: number;
  lastUpdated: Date;
} 