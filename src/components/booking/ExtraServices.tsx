import { useState } from 'react';
import { Car, ShoppingBasket, MessageSquare } from 'lucide-react';
import AirportTransferModal from './services/AirportTransferModal';
import FridgeServiceModal from './services/FridgeServiceModal';

interface ExtraServicesProps {
  selected: string[];
  onChange: (services: string[]) => void;
  onNext: () => void;
}

export default function ExtraServices({ selected, onChange, onNext }: ExtraServicesProps) {
  const [showAirportModal, setShowAirportModal] = useState(false);
  const [showFridgeModal, setShowFridgeModal] = useState(false);
  const [serviceDetails, setServiceDetails] = useState<Record<string, any>>({});

  const services = [
    {
      id: 'airport-transfer',
      name: 'Airport Transfer',
      description: 'Comfortable transfer from JKIA or Wilson Airport',
      price: 30,
      icon: Car,
      onClick: () => setShowAirportModal(true)
    },
    {
      id: 'fridge-fill',
      name: 'Fill Up my Fridge',
      description: 'Pre-stock your fridge with groceries',
      price: 50,
      icon: ShoppingBasket,
      onClick: () => setShowFridgeModal(true)
    },
    {
      id: 'special-requests',
      name: 'Special Requests',
      description: 'Any other specific requirements',
      icon: MessageSquare
    }
  ];

  const handleAirportDetails = (details: any) => {
    setServiceDetails(prev => ({ ...prev, 'airport-transfer': details }));
    if (!selected.includes('airport-transfer')) {
      onChange([...selected, 'airport-transfer']);
    }
  };

  const handleFridgeDetails = (details: any) => {
    setServiceDetails(prev => ({ ...prev, 'fridge-fill': details }));
    if (!selected.includes('fridge-fill')) {
      onChange([...selected, 'fridge-fill']);
    }
  };

  const toggleService = (service: any) => {
    if (service.onClick) {
      service.onClick();
    } else {
      onChange(
        selected.includes(service.id)
          ? selected.filter(s => s !== service.id)
          : [...selected, service.id]
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className={`
              p-4 border rounded-lg cursor-pointer transition-colors
              ${selected.includes(service.id)
                ? 'border-amber-600 bg-amber-50'
                : 'border-gray-200 hover:border-amber-600'
              }
            `}
            onClick={() => toggleService(service)}
          >
            <div className="flex items-start gap-4">
              <service.icon className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div className="flex-grow">
                <h3 className="font-medium">{service.name}</h3>
                <p className="text-sm text-gray-600">{service.description}</p>
                {service.price && (
                  <p className="text-amber-600 font-medium mt-1">
                    ${service.price}
                  </p>
                )}
                {serviceDetails[service.id] && (
                  <div className="mt-2 text-sm text-gray-600">
                    {service.id === 'airport-transfer' && (
                      <>Flight: {serviceDetails[service.id].flightNumber || 'Not provided'}</>
                    )}
                    {service.id === 'fridge-fill' && (
                      <>{serviceDetails[service.id].items.length} items selected</>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full bg-amber-600 text-white py-3 rounded-full font-medium hover:bg-amber-700 transition-colors"
      >
        Continue to Payment
      </button>

      <AirportTransferModal
        isOpen={showAirportModal}
        onClose={() => setShowAirportModal(false)}
        onConfirm={handleAirportDetails}
      />

      <FridgeServiceModal
        isOpen={showFridgeModal}
        onClose={() => setShowFridgeModal(false)}
        onConfirm={handleFridgeDetails}
      />
    </div>
  );
}