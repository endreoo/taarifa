import axios from 'axios';
import { format } from 'date-fns';
import { config } from '../config/environment';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';

interface EzeeBookingRequest {
  RES_Response: {
    Reservations: {
      Reservation: {
        HotelCode: string;
        BookingID: string;
        Status: string;
        Source: string;
        Code: string;
        CCNo: string;
        CCType: string;
        CCExpiryDate: string;
        CardHoldersName: string;
        BookingTran: {
          SubBookingId: string;
          RateTypeID: string;
          RateType: string;
          RoomTypeCode: string;
          RoomTypeName: string;
          Start: string;
          End: string;
          TotalRate: number;
          TotalDiscount: number;
          TotalExtraCharge: number;
          TotalTax: number;
          TotalPayment: number;
          Salutation: string;
          FirstName: string;
          LastName: string;
          Gender: string;
          Address: string;
          City: string;
          State: string;
          Country: string;
          Zipcode: string;
          Phone: string;
          Mobile: string;
          Fax: string;
          Email: string;
          TransportationMode: string;
          Vehicle: string;
          PickupDate: string;
          PickupTime: string;
          Comment: string;
          RentalInfo: {
            EffectiveDate: string;
            Adult: number;
            Child: number;
            Rent: number;
            ExtraCharge: number;
            Tax: number;
            Discount: number;
          };
        };
      };
    };
  };
}

export class EzeeBookingService {
  private hotelCode: string;
  private authCode: string;
  private baseUrl: string;

  constructor() {
    this.hotelCode = config.ezeeApi.hotelCode;
    this.authCode = config.ezeeApi.authCode;
    this.baseUrl = 'https://live.ipms247.com';
  }

  async createBooking(bookingData: {
    checkInDate: Date;
    checkOutDate: Date;
    roomTypeId: string;
    numberOfRooms: number;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    guestAddress: string;
    guestCity: string;
    guestCountry: string;
    numberOfAdults: number;
    numberOfChildren: number;
    specialRequests?: string;
    paymentAmount: number;
    paymentReference: string;
    paymentStatus: 'Pending' | 'Confirmed';
  }) {
    try {
      // Split full name into first and last name
      const nameParts = bookingData.guestName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || firstName;

      const requestData: EzeeBookingRequest = {
        RES_Response: {
          Reservations: {
            Reservation: {
              HotelCode: this.hotelCode,
              BookingID: bookingData.paymentReference,
              Status: 'New',
              Source: 'Website',
              Code: '',
              CCNo: '',
              CCType: '',
              CCExpiryDate: '',
              CardHoldersName: '',
              BookingTran: {
                SubBookingId: '1',
                RateTypeID: this.getRatePlanId(bookingData.roomTypeId),
                RateType: this.getRoomTypeName(bookingData.roomTypeId),
                RoomTypeCode: bookingData.roomTypeId,
                RoomTypeName: this.getRoomTypeName(bookingData.roomTypeId),
                Start: format(bookingData.checkInDate, 'yyyy-MM-dd'),
                End: format(bookingData.checkOutDate, 'yyyy-MM-dd'),
                TotalRate: bookingData.paymentAmount,
                TotalDiscount: 0,
                TotalExtraCharge: 0,
                TotalTax: 0,
                TotalPayment: bookingData.paymentAmount,
                Salutation: '',
                FirstName: firstName,
                LastName: lastName,
                Gender: '',
                Address: bookingData.guestAddress,
                City: bookingData.guestCity,
                State: '',
                Country: bookingData.guestCountry,
                Zipcode: '',
                Phone: bookingData.guestPhone,
                Mobile: bookingData.guestPhone,
                Fax: '',
                Email: bookingData.guestEmail,
                TransportationMode: '',
                Vehicle: '',
                PickupDate: '',
                PickupTime: '',
                Comment: bookingData.specialRequests || '',
                RentalInfo: {
                  EffectiveDate: format(bookingData.checkInDate, 'yyyy-MM-dd'),
                  Adult: bookingData.numberOfAdults,
                  Child: bookingData.numberOfChildren,
                  Rent: bookingData.paymentAmount,
                  ExtraCharge: 0,
                  Tax: 0,
                  Discount: 0
                }
              }
            }
          }
        }
      };

      const builder = new XMLBuilder();
      const xmlData = builder.build(requestData);

      console.log('Creating reservation in eZee:', xmlData);

      const createResponse = await axios.post(
        `${this.baseUrl}/pmsinterface/getdataAPI.php`,
        xmlData,
        {
          headers: {
            'Content-Type': 'application/xml',
            'Accept': 'application/xml'
          }
        }
      );

      const parser = new XMLParser();
      const result = parser.parse(createResponse.data);

      if (result.RES_Response?.Success) {
        return {
          success: true,
          bookingId: bookingData.paymentReference,
          message: result.RES_Response.Success.SuccessMsg || 'Booking created successfully'
        };
      } else if (result.RES_Response?.Errors) {
        throw new Error(result.RES_Response.Errors.ErrorMessage || 'Failed to create booking');
      } else {
        throw new Error('Unknown error while creating booking');
      }
    } catch (error: any) {
      console.error('Error in eZee booking process:', error);
      throw new Error(`Booking failed: ${error.message}`);
    }
  }

  private getRatePlanId(roomTypeId: string): string {
    const ratePlanMap: Record<string, string> = {
      '@1826200000000000001': '@1826200000000000025', // Normal Studio
      '@1826200000000000002': '@1826200000000000026', // Large Studio
      '@1826200000000000003': '@1826200000000000027', // Studio with Balcony
      '@1826200000000000004': '@1826200000000000028', // Studio with Balcony&Pentloft
      '@1826200000000000005': '@1826200000000000029', // One Bedroom
    };
    return ratePlanMap[roomTypeId] || '';
  }

  private getRoomTypeName(roomTypeId: string): string {
    const roomTypeMap: Record<string, string> = {
      '@1826200000000000001': 'Normal Studio',
      '@1826200000000000002': 'Large Studio',
      '@1826200000000000003': 'Studio with Balcony',
      '@1826200000000000004': 'Studio with Balcony&Pentloft',
      '@1826200000000000005': 'One Bedroom',
      '@1826200000000000006': 'Two Bedroom'
    };
    return roomTypeMap[roomTypeId] || '';
  }
} 