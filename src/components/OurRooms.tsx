import { useState, useEffect } from 'react';
import { EzeeAPI } from '../services/EzeeAPI';
import { CurrencyService } from '../services/CurrencyService';
import { config } from '../config/environment';
import { MappedRoom } from '../types/room';

export function OurRooms() {
  const [lowestRates, setLowestRates] = useState<Record<string, number>>({});
  const [availability, setAvailability] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchRatesAndAvailability();
  }, []);

  const fetchRatesAndAvailability = async () => {
    try {
      const api = new EzeeAPI();
      const fromDate = new Date().toISOString().split('T')[0];
      const toDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const rooms = await api.getRoomInventoryWithDetails(fromDate, toDate);
      
      const rates: Record<string, number> = {};
      const avail: Record<string, number> = {};
      
      rooms.forEach(room => {
        rates[room.websiteRoomId] = Math.min(...room.rates.map(r => r.baseRate));
        avail[room.websiteRoomId] = room.availability;
      });
      
      setLowestRates(rates);
      setAvailability(avail);
    } catch (error) {
      console.error('Error fetching rates and availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (roomType: string) => {
    const fromDate = new Date().toISOString().split('T')[0];
    const toDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const params = new URLSearchParams({
      roomType: roomType,
      checkIn: fromDate,
      checkOut: toDate
    });

    window.location.href = `/booking?${params.toString()}`;
  };

  if (loading) {
    return <div className="loading">Loading room rates and availability...</div>;
  }

  return (
    <section className="our-rooms">
      <h2>Our Luxury Apartments</h2>
      
      <div className="room-grid">
        {/* Studio Apartment */}
        <div className="room-card">
          <h3>Studio Apartment</h3>
          <img src="/images/rooms/studio-1.jpg" alt="Studio Apartment" />
          <p>Modern studio apartment perfect for singles or couples. Features a combined living and sleeping area, fully equipped kitchenette, and modern bathroom.</p>
          <div className="occupancy">
            <span className="occupancy-icon">👥</span>
            <span>Max Occupancy: 2 adults, 1 child</span>
          </div>
          {availability['studio-apartment'] > 0 ? (
            <>
              <div className="price">
                <span>From {CurrencyService.formatUSD(CurrencyService.convertKEStoUSD(lowestRates['studio-apartment'] || 6500))}/night</span>
                <span className="price-kes">(From {CurrencyService.formatKES(lowestRates['studio-apartment'] || 6500)})</span>
              </div>
              <button 
                className="book-now"
                onClick={() => handleBookNow('studio-apartment')}
              >
                Book Now
              </button>
            </>
          ) : (
            <div className="no-availability">Not available for selected dates</div>
          )}
        </div>

        {/* One Bedroom Apartment */}
        <div className="room-card">
          <h3>One Bedroom Apartment</h3>
          <img src="/images/rooms/one-bedroom-1.jpg" alt="One Bedroom Apartment" />
          <p>Spacious one bedroom apartment with separate bedroom and living area, full kitchen, and modern amenities.</p>
          <div className="occupancy">
            <span className="occupancy-icon">👥</span>
            <span>Max Occupancy: 2 adults, 1 child</span>
          </div>
          {availability['one-bedroom'] > 0 ? (
            <>
              <div className="price">
                <span>From {CurrencyService.formatUSD(CurrencyService.convertKEStoUSD(lowestRates['one-bedroom'] || 9000))}/night</span>
                <span className="price-kes">(From {CurrencyService.formatKES(lowestRates['one-bedroom'] || 9000)})</span>
              </div>
              <button 
                className="book-now"
                onClick={() => handleBookNow('one-bedroom')}
              >
                Book Now
              </button>
            </>
          ) : (
            <div className="no-availability">Not available for selected dates</div>
          )}
        </div>

        {/* Two Bedroom Apartment */}
        <div className="room-card">
          <h3>Two Bedroom Apartment</h3>
          <img src="/images/rooms/two-bedroom-1.jpg" alt="Two Bedroom Apartment" />
          <p>Luxurious two bedroom apartment ideal for families or sharing. Features two separate bedrooms, spacious living area, full kitchen, and modern amenities.</p>
          <div className="occupancy">
            <span className="occupancy-icon">👥</span>
            <span>Max Occupancy: 4 adults, 2 children</span>
          </div>
          {availability['two-bedroom'] > 0 ? (
            <>
              <div className="price">
                <span>From {CurrencyService.formatUSD(CurrencyService.convertKEStoUSD(lowestRates['two-bedroom'] || 12000))}/night</span>
                <span className="price-kes">(From {CurrencyService.formatKES(lowestRates['two-bedroom'] || 12000)})</span>
              </div>
              <button 
                className="book-now"
                onClick={() => handleBookNow('two-bedroom')}
              >
                Book Now
              </button>
            </>
          ) : (
            <div className="no-availability">Not available for selected dates</div>
          )}
        </div>
      </div>
    </section>
  );
} 