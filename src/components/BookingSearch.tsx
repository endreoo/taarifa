import { useState } from 'react';
import { useEzeeAPI } from '../hooks/useEzeeAPI';
import { roomMappings, getRoomsByCategory } from '../config/roomMapping';
import { MappedRoom, Rate } from '../types/room';
import { CurrencyService } from '../services/CurrencyService';

export function BookingSearch() {
  const { getAvailabilityAndRates, loading, error } = useEzeeAPI();
  const [searchDates, setSearchDates] = useState({
    fromDate: '',
    toDate: ''
  });
  const [roomsByCategory, setRoomsByCategory] = useState<Record<string, MappedRoom[]>>({});

  const handleSearch = async () => {
    try {
      const rooms = await getAvailabilityAndRates(
        searchDates.fromDate, 
        searchDates.toDate
      );
      setRoomsByCategory(getRoomsByCategory(rooms));
    } catch (err) {
      // Handle error
    }
  };

  const formatRates = (rate: Rate) => {
    const baseRateUSD = CurrencyService.convertKEStoUSD(rate.baseRate);
    const extraAdultUSD = CurrencyService.convertKEStoUSD(rate.extraAdultRate);
    const extraChildUSD = CurrencyService.convertKEStoUSD(rate.extraChildRate);

    return (
      <div key={rate.rateTypeId} className="rate-details">
        <div className="rate-row">
          <div className="rate-label">Base Rate:</div>
          <div className="rate-amounts">
            <span className="rate-kes">{CurrencyService.formatKES(rate.baseRate)}</span>
            <span className="rate-usd">{CurrencyService.formatUSD(baseRateUSD)}</span>
          </div>
        </div>
        <div className="rate-row">
          <div className="rate-label">Extra Adult:</div>
          <div className="rate-amounts">
            <span className="rate-kes">{CurrencyService.formatKES(rate.extraAdultRate)}</span>
            <span className="rate-usd">{CurrencyService.formatUSD(extraAdultUSD)}</span>
          </div>
        </div>
        <div className="rate-row">
          <div className="rate-label">Extra Child:</div>
          <div className="rate-amounts">
            <span className="rate-kes">{CurrencyService.formatKES(rate.extraChildRate)}</span>
            <span className="rate-usd">{CurrencyService.formatUSD(extraChildUSD)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <input 
        type="date"
        value={searchDates.fromDate}
        onChange={(e) => setSearchDates(prev => ({
          ...prev,
          fromDate: e.target.value
        }))}
      />
      <input 
        type="date"
        value={searchDates.toDate}
        onChange={(e) => setSearchDates(prev => ({
          ...prev,
          toDate: e.target.value
        }))}
      />
      <button onClick={handleSearch} disabled={loading}>
        Search
      </button>

      {error && <div className="error">{error.message}</div>}
      
      {Object.entries(roomsByCategory).map(([category, rooms]) => (
        <div key={category} className="room-category">
          <h2>{category}</h2>
          <div className="room-list">
            {rooms.map(room => (
              <div key={room.websiteRoomId} className="room-card">
                <div className="room-image">
                  <img 
                    src={room.image} 
                    alt={`${room.name}`} 
                  />
                </div>
                <div className="room-details">
                  <h3>{room.name}</h3>
                  <p>{room.description}</p>
                  <p>Available: {room.availability}</p>
                  <p>Max Occupancy: {room.maxOccupancy.adults} adults, {room.maxOccupancy.children} children</p>
                  {room.rates.map(formatRates)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 