import axios from 'axios';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { roomMappings } from '../config/roomMapping';
import { Room, MappedRoom, Rate } from '../types/room';
import { config } from '../config/environment';

interface RoomRate {
  Base: number;
  ExtraAdult: number;
  ExtraChild: number;
}

interface RateType {
  RoomTypeID: string;
  RateTypeID: string;
  FromDate: string;
  ToDate: string;
  RoomRate: RoomRate;
}

interface RoomType {
  RoomTypeID: string;
  FromDate: string;
  ToDate: string;
  Availability: number;
}

interface ApiResponse {
  RES_Response: {
    RoomInfo: {
      Source: {
        RoomTypes: {
          RoomType: RoomType[];
          RateType: RateType[];
        }
      }
    }
  }
}

interface BookingDetails {
  roomTypeId: string;
  checkIn: string;
  checkOut: string;
  guestDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    adults: number;
    children: number;
    specialRequests: string;
  };
  rateId: string;
}

export class EzeeAPI {
  private hotelCode: string;
  private authCode: string;
  private baseUrl: string;
  private proxyUrl: string;

  constructor() {
    this.hotelCode = config.ezeeApi.hotelCode;
    this.authCode = config.ezeeApi.authCode;
    this.baseUrl = 'https://live.ipms247.com/pmsinterface/getdataAPI.php';
    this.proxyUrl = `${config.apiBaseUrl}/api/ezee`;
  }

  private async makeApiCall(requestXml: string) {
    try {
      console.log('Making API call with XML:', requestXml);
      
      const response = await axios.post(
        '/api/ezee',
        requestXml,
        {
          headers: {
            'Content-Type': 'application/xml',
            'Accept': 'application/xml',
            'X-Ezee-Url': this.baseUrl,
            'X-Ezee-Hotel': this.hotelCode,
            'X-Ezee-Auth': this.authCode
          },
          timeout: 60000,
          maxRedirects: 5
        }
      );

      if (!response.data) {
        throw new Error('Empty response from API');
      }

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_"
      });
      const result = parser.parse(response.data);

      if (result.RES_Response?.Errors) {
        console.error('eZee API Error:', result.RES_Response.Errors);
        throw new Error(`eZee API Error: ${JSON.stringify(result.RES_Response.Errors)}`);
      }

      if (!result.RES_Response?.RoomInfo) {
        console.error('Invalid response format:', result);
        throw new Error('Invalid response format from eZee API');
      }

      return result;
    } catch (error) {
      console.error('API Call Failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        requestXml
      });
      throw error;
    }
  }

  private mapRoom(ezeeRoom: RoomType, rates: RateType[]): MappedRoom | null {
    const mapping = roomMappings.find(m => m.ezeeRoomTypeId.includes(ezeeRoom.RoomTypeID));
    if (!mapping) {
      console.warn(`No mapping found for eZee room type ${ezeeRoom.RoomTypeID}`);
      return null;
    }

    const mappedRates: Rate[] = rates
      .filter((rate: RateType) => rate.RoomTypeID === ezeeRoom.RoomTypeID)
      .map((rate: RateType) => ({
        rateTypeId: rate.RateTypeID,
        baseRate: rate.RoomRate.Base,
        extraAdultRate: 0,
        extraChildRate: 0
      }));

    return {
      roomTypeId: ezeeRoom.RoomTypeID,
      availability: ezeeRoom.Availability,
      rates: mappedRates,
      websiteRoomId: mapping.websiteRoomId,
      name: mapping.name,
      description: mapping.description,
      image: mapping.image,
      maxOccupancy: mapping.maxOccupancy,
      amenities: (mapping as any).amenities || []
    };
  }

  async getRoomInventory(fromDate: string, toDate: string) {
    const xml = new XMLBuilder().build({
      RES_Request: {
        Request_Type: 'Inventory',
        Authentication: {
          HotelCode: this.hotelCode,
          AuthCode: this.authCode
        },
        FromDate: fromDate,
        ToDate: toDate
      }
    });

    try {
      const result = await this.makeApiCall(xml);
      return result.RES_Response.RoomInfo;
    } catch (error) {
      console.error('Error fetching room inventory:', error);
      throw error;
    }
  }

  async getRoomRates(fromDate: string, toDate: string) {
    const xml = new XMLBuilder().build({
      RES_Request: {
        Request_Type: 'Rate', 
        Authentication: {
          HotelCode: this.hotelCode,
          AuthCode: this.authCode
        },
        FromDate: fromDate,
        ToDate: toDate
      }
    });

    try {
      const result = await this.makeApiCall(xml);
      const rateTypes = result.RES_Response.RoomInfo.Source[0]?.RoomTypes?.RateType || [];
      return {
        Source: {
          RoomTypes: {
            RateType: rateTypes
          }
        }
      };
    } catch (error) {
      console.error('Error fetching room rates:', error);
      throw error;
    }
  }

  async getRoomInventoryWithDetails(fromDate: string, toDate: string): Promise<MappedRoom[]> {
    try {
      const [inventory, rates] = await Promise.all([
        this.getRoomInventory(fromDate, toDate),
        this.getRoomRates(fromDate, toDate)
      ]);

      console.log(`Fetching room details for dates: ${fromDate} to ${toDate}`);

      const roomTypes = Array.isArray(inventory.Source.RoomTypes.RoomType) 
        ? inventory.Source.RoomTypes.RoomType 
        : [inventory.Source.RoomTypes.RoomType];

      const rateTypes = rates?.Source?.RoomTypes?.RateType || [];

      const groupedRooms = roomMappings.map(mapping => {
        const matchingRooms = roomTypes.filter((room: RoomType) => 
          mapping.ezeeRoomTypeId.includes(room.RoomTypeID)
        );

        if (matchingRooms.length === 0) return null;

        const totalAvailability = matchingRooms.reduce(
          (sum: number, room: RoomType) => sum + room.Availability, 
          0
        );

        const primaryRoomTypeId = mapping.ezeeRoomTypeId[0];
        const roomRates = rateTypes
          .filter((rate: RateType) => rate.RoomTypeID === primaryRoomTypeId)
          .map((rate: RateType) => ({
            rateTypeId: rate.RateTypeID,
            baseRate: Math.round(rate.RoomRate.Base),
            extraAdultRate: 0,
            extraChildRate: 0
          }));

        const lowestRate = Math.round(roomRates.reduce((min: number, rate: Rate) => 
          rate.baseRate < min ? rate.baseRate : min, 
          roomRates[0]?.baseRate || 0
        ));

        console.log(`
          Room: ${mapping.name}
          Date Range: ${fromDate} to ${toDate}
          Availability: ${totalAvailability}
          Lowest Rate: KES ${lowestRate.toLocaleString()}
        `);

        return {
          roomTypeId: primaryRoomTypeId,
          availability: totalAvailability,
          rates: roomRates,
          websiteRoomId: mapping.websiteRoomId,
          name: mapping.name,
          description: mapping.description,
          image: mapping.image,
          maxOccupancy: mapping.maxOccupancy,
          amenities: (mapping as any).amenities || []
        };
      }).filter(room => room !== null);

      return groupedRooms;
    } catch (error) {
      console.error('Error in getRoomInventoryWithDetails:', error);
      throw error;
    }
  }

  async createBooking(details: BookingDetails) {
    const xml = new XMLBuilder().build({
      RES_Request: {
        Request_Type: 'Reservation',
        Authentication: {
          HotelCode: this.hotelCode,
          AuthCode: this.authCode
        },
        RoomTypes: {
          RoomType: {
            RoomTypeID: details.roomTypeId,
            RateTypeID: details.rateId,
            FromDate: details.checkIn,
            ToDate: details.checkOut,
            Adults: details.guestDetails.adults,
            Children: details.guestDetails.children
          }
        },
        CustomerInfo: {
          FirstName: details.guestDetails.firstName,
          LastName: details.guestDetails.lastName,
          Email: details.guestDetails.email,
          Phone: details.guestDetails.phone,
          SpecialRequest: details.guestDetails.specialRequests
        }
      }
    });

    try {
      const response = await axios.post(
        `${this.baseUrl}/pmsinterface/getdataAPI.php`,
        xml,
        {
          headers: {
            'Content-Type': 'application/xml'
          }
        }
      );

      const parser = new XMLParser();
      const result = parser.parse(response.data);
      return result;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }
} 