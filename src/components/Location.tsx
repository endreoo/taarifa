import { MapPin, Phone, Mail, Navigation, Car, Store, TreePine, Building2, ShoppingBag, Trees, Landmark, Share2, Send, Search, MessageCircle, Check } from 'lucide-react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindow, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: -1.2713274523897091,
  lng: 36.814327
};

const nearbyPlaces = [
  {
    name: "Parklands Shopping Center",
    position: { lat: -1.2697, lng: 36.8152 },
    icon: ShoppingBag,
    duration: "5 min",
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/shopping.png"
  },
  {
    name: "City Park Forest",
    position: { lat: -1.2667, lng: 36.8167 },
    icon: Trees,
    duration: "7 min",
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/tree.png"
  },
  {
    name: "Aga Khan Hospital",
    position: { lat: -1.2636, lng: 36.8168 },
    icon: Landmark,
    duration: "8 min",
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/landmark.png"
  }
];

const mapOptions = {
  styles: [
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [{ color: "#666666" }]
    }
  ],
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: true,
  streetViewControl: true,
  rotateControl: false,
  fullscreenControl: true
};

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"];

interface DirectionsInfo {
  distance: string;
  duration: string;
  startAddress: string;
  endAddress: string;
  googleMapsUrl: string;
}

// Use WAHA API directly with HTTPS
const WAHA_API_URL = 'https://wa.hotelonline.co/api/sendText';

// Helper function to format phone number
const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If starts with 0, replace with 254
  if (digits.startsWith('0')) {
    return '254' + digits.substring(1);
  }
  
  // If starts with 254, keep as is
  if (digits.startsWith('254')) {
    return digits;
  }
  
  // If it's 9 digits (without country code), add 254
  if (digits.length === 9) {
    return '254' + digits;
  }
  
  // If starts with +, remove it
  if (phone.startsWith('+')) {
    return digits;
  }
  
  return digits;
};

const getGeolocationErrorMessage = (error: GeolocationPositionError) => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "Location access was denied. Please enter your location manually.";
    case error.POSITION_UNAVAILABLE:
      return "Location information is unavailable. Please enter your location manually.";
    case error.TIMEOUT:
      return "Location request timed out. Please try again or enter your location manually.";
    default:
      return "Failed to get your location. Please enter your location manually.";
  }
};

export default function Location() {
  const { user } = useAuth();
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<typeof nearbyPlaces[0] | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [showDirectionsMenu, setShowDirectionsMenu] = useState(false);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [searchType, setSearchType] = useState<'from' | 'to'>('from');
  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [directionsError, setDirectionsError] = useState<string | null>(null);
  const [customLocation, setCustomLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [directionsInfo, setDirectionsInfo] = useState<DirectionsInfo | null>(null);
  const [departureTime, setDepartureTime] = useState<Date>(new Date());
  const [userContact, setUserContact] = useState(user ? (user.phone || user.email || '') : '');
  const [contactType, setContactType] = useState<'whatsapp' | 'email'>(user?.phone ? 'whatsapp' : 'email');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (loadError) {
      console.error('Google Maps loading error:', loadError);
      setDirectionsError('Failed to load Google Maps. Please refresh the page.');
    }
  }, [loadError]);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    try {
      mapRef.current = map;
    } catch (error) {
      console.error('Map load error:', error);
      setDirectionsError('Error initializing map. Please refresh the page.');
    }
  }, []);

  const onPlaceSelected = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry?.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        setCustomLocation(location);
        setShowLocationSearch(false);
        handleGetDirections('map', location);
      }
    }
  };

  const resetDirections = () => {
    setDirections(null);
    setDirectionsInfo(null);
    setShowDirections(false);
    setCustomLocation(null);
    setDirectionsError(null);
    if (mapRef.current) {
      mapRef.current.setZoom(15);
      mapRef.current.setCenter(center);
    }
  };

  const getGoogleMapsUrl = (origin: string, destination: string) => {
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
  };

  const formatDirections = (result: google.maps.DirectionsResult) => {
    const route = result.routes[0].legs[0];
    const mapsUrl = getGoogleMapsUrl(route.start_address || '', route.end_address || '');
    
    return `
🚗 Directions to Taarifa Suites
---------------------------
Travel ${searchType === 'from' ? 'from' : 'to'} Taarifa
From: ${route.start_address}
To: Taarifa Suites, 17 Ojijo Rd, Nairobi
When: ${departureTime.toLocaleString('en-US', { 
  weekday: 'short', 
  month: 'short', 
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true 
})}

Distance: ${route.distance?.text}
Est. Time: ${route.duration?.text}

📍 Open in Google Maps:
${mapsUrl}

Need a ride? Contact us to arrange a taxi!
📞 +254700000000

Taarifa Suites - Your Home Away From Home
    `;
  };

  const handleContactKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && userContact) {
      handleGetDirections(contactType);
      setShowDirectionsMenu(false);
    }
  };

  const sendWhatsAppMessage = async (phone: string, text: string) => {
    try {
      const formattedPhone = formatPhoneNumber(phone);
      console.log('Attempting to send WhatsApp message:', {
        phone: formattedPhone,
        messageLength: text.length
      });

      if (formattedPhone.length < 12) {
        throw new Error('Please enter a valid phone number with country code (e.g., 254712345678)');
      }

      const payload = {
        session: 'default',
        chatId: `${formattedPhone}@c.us`,
        text: text
      };
      console.log('Sending request with payload:', payload);

      // Send directly to WAHA API
      const response = await fetch(WAHA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Raw response:', response);
      const responseText = await response.text();
      console.log('Response text:', responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('Parsed response data:', responseData);
      } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error(responseData?.message || `Failed to send WhatsApp message. Status: ${response.status}`);
      }

      setSuccessMessage(`Directions sent to your WhatsApp! (${formattedPhone})`);
      return true;
    } catch (error) {
      console.error('Detailed WhatsApp error:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined
      });
      setDirectionsError(error instanceof Error ? error.message : 'Failed to send WhatsApp message');
      return false;
    }
  };

  const handleGetDirections = useCallback(async (
    method: 'map' | 'whatsapp' | 'email' | 'taxi',
    customLocation?: google.maps.LatLngLiteral
  ) => {
    console.log('handleGetDirections called with method:', method);
    setDirectionsError(null);
    setSuccessMessage(null);

    // If we already have directions and it's not a map request, use existing directions
    if (directionsInfo && method !== 'map') {
      console.log('Using existing directions for:', method);
      const text = `
🚗 Directions to Taarifa Suites
---------------------------
From: ${directionsInfo.startAddress}
To: ${directionsInfo.endAddress}
Distance: ${directionsInfo.distance}
Est. Time: ${directionsInfo.duration}

📍 Open in Google Maps:
${directionsInfo.googleMapsUrl}

Need a ride? Contact us to arrange a taxi!
📞 +254700000000

Taarifa Suites - Your Home Away From Home
      `;

      switch (method) {
        case 'whatsapp':
          if (!userContact) {
            setDirectionsError("Please enter your WhatsApp number");
            return;
          }
          console.log('Sending existing directions to WhatsApp');
          const sent = await sendWhatsAppMessage(userContact, text);
          if (!sent) {
            setDirectionsError("Failed to send WhatsApp message. Please try again.");
          }
          return;

        case 'email':
          if (!userContact) {
            setDirectionsError("Please enter your email address");
            return;
          }
          const emailSubject = 'Directions to Taarifa Suites';
          window.location.href = `mailto:${userContact}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(text)}`;
          setSuccessMessage(`Email prepared with directions! Opening your email app...`);
          return;

        case 'taxi':
          alert('Taxi booking feature coming soon! Please contact us directly to arrange transportation.');
          return;
      }
    }

    if (!isLoaded || !mapRef.current) {
      setDirectionsError("Map is not fully loaded yet. Please try again.");
      return;
    }

    if (!customLocation && !showLocationSearch) {
      setShowLocationSearch(true);
      return;
    }

    try {
      console.log('Getting route with location:', customLocation);
      const directionsService = new google.maps.DirectionsService();
      
      if (!customLocation) {
        setDirectionsError("Please enter a location first");
        return;
      }

      const request: google.maps.DirectionsRequest = {
        origin: searchType === 'from' ? center : customLocation,
        destination: searchType === 'from' ? customLocation : center,
        travelMode: google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: departureTime
        }
      };

      const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
        directionsService.route(request, (result, status) => {
          console.log('Direction service response:', { status, result });
          if (status === google.maps.DirectionsStatus.OK && result) {
            resolve(result);
          } else {
            reject(new Error(`Directions request failed: ${status}`));
          }
        });
      });

      const route = result.routes[0].legs[0];
      const mapsUrl = getGoogleMapsUrl(route.start_address || '', route.end_address || '');
      
      setDirectionsInfo({
        distance: route.distance?.text || '',
        duration: route.duration?.text || '',
        startAddress: route.start_address || '',
        endAddress: route.end_address || '',
        googleMapsUrl: mapsUrl
      });

      switch (method) {
        case 'map':
          setShowDirections(true);
          setDirections(result);
          if (mapRef.current && result.routes[0].bounds) {
            mapRef.current.fitBounds(result.routes[0].bounds);
          }
          break;

        case 'whatsapp':
          if (!userContact) {
            setDirectionsError("Please enter your WhatsApp number");
            return;
          }
          const whatsappText = formatDirections(result);
          const sent = await sendWhatsAppMessage(userContact, whatsappText);
          if (!sent) {
            setDirectionsError("Failed to send WhatsApp message. Please try again.");
          }
          break;

        case 'email':
          if (!userContact) {
            setDirectionsError("Please enter your email address");
            return;
          }
          const emailText = formatDirections(result);
          const emailSubject = 'Directions to Taarifa Suites';
          window.location.href = `mailto:${userContact}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailText)}`;
          setSuccessMessage(`Email prepared with directions! Opening your email app...`);
          break;

        case 'taxi':
          alert('Taxi booking feature coming soon! Please contact us directly to arrange transportation.');
          break;
      }
    } catch (error) {
      console.error('Error getting directions:', error);
      setDirectionsError("Failed to get directions. Please try again.");
    }
  }, [isLoaded, searchType, departureTime, userContact, directionsInfo]);

  if (!isLoaded) {
    return (
      <section id="location" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>Loading map...</p>
        </div>
      </section>
    );
  }

  if (loadError) {
    return (
      <section id="location" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center text-red-600">
          <p>Error loading map. Please refresh the page.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="location" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold mb-4">Prime Location</h2>
          <p className="text-gray-600">Located in the heart of Parklands, Nairobi's most prestigious neighborhood</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="text-amber-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">Address</h3>
                  <p className="text-gray-600">Ojiji Road, Parklands, Nairobi, Kenya</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="text-amber-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">Phone</h3>
                  <p className="text-gray-600">+254 (0) 700 000 000</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="text-amber-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">Email</h3>
                  <p className="text-gray-600">reservations@taarifasuites.com</p>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowDirectionsMenu(!showDirectionsMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors w-full"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                  <Share2 className="w-4 h-4 ml-auto" />
                </button>

                {showDirectionsMenu && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-10">
                    <div className="p-2 border-b">
                      <div className="flex gap-2 mb-2">
                        <button
                          onClick={() => setSearchType('from')}
                          className={`flex-1 px-3 py-1 rounded ${searchType === 'from' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100'}`}
                        >
                          Travel from Taarifa
                        </button>
                        <button
                          onClick={() => setSearchType('to')}
                          className={`flex-1 px-3 py-1 rounded ${searchType === 'to' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100'}`}
                        >
                          Travel to Taarifa
                        </button>
                      </div>
                      
                      <div className="relative mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">When:</label>
                        <input
                          type="datetime-local"
                          value={departureTime.toISOString().slice(0, 16)}
                          onChange={(e) => setDepartureTime(new Date(e.target.value))}
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                          min={new Date().toISOString().slice(0, 16)}
                        />
                      </div>

                      {isLoaded && (
                        <div className="relative">
                          <Autocomplete
                            onLoad={(autocomplete) => {
                              autocompleteRef.current = autocomplete;
                            }}
                            onPlaceChanged={onPlaceSelected}
                          >
                            <input
                              type="text"
                              placeholder={searchType === 'from' ? 
                                'Enter destination location' : 
                                'Enter starting location'
                              }
                              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-amber-600"
                            />
                          </Autocomplete>
                          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        </div>
                      )}

                      {directionsInfo && (
                        <div className="mt-4 space-y-4">
                          <div className="text-sm text-gray-600 space-y-2">
                            <p className="flex items-center gap-2">
                              <span className="font-semibold">From:</span> 
                              {directionsInfo.startAddress}
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="font-semibold">To:</span> 
                              Taarifa Suites, 17 Ojijo Rd, Nairobi
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="font-semibold">When:</span>
                              {departureTime.toLocaleString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true 
                              })}
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="font-semibold">Distance:</span> 
                              {directionsInfo.distance}
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="font-semibold">Est. Time:</span> 
                              {directionsInfo.duration}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setContactType('whatsapp')}
                                className={`flex-1 px-3 py-2 rounded flex items-center justify-center gap-2 ${
                                  contactType === 'whatsapp' 
                                    ? 'bg-green-100 text-green-600 border-2 border-green-600' 
                                    : 'bg-gray-100 hover:bg-green-50'
                                }`}
                              >
                                <MessageCircle className="w-4 h-4" />
                                WhatsApp
                              </button>
                              <button
                                onClick={() => setContactType('email')}
                                className={`flex-1 px-3 py-2 rounded flex items-center justify-center gap-2 ${
                                  contactType === 'email' 
                                    ? 'bg-blue-100 text-blue-600 border-2 border-blue-600' 
                                    : 'bg-gray-100 hover:bg-blue-50'
                                }`}
                              >
                                <Mail className="w-4 h-4" />
                                Email
                              </button>
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder={
                                  contactType === 'whatsapp' 
                                    ? 'Enter phone number (e.g., 0712345678 or 254712345678)' 
                                    : 'Enter your email'
                                }
                                value={userContact}
                                onChange={(e) => setUserContact(e.target.value)}
                                onKeyPress={handleContactKeyPress}
                                className="w-full px-3 py-2 pl-10 border rounded focus:outline-none focus:border-amber-600"
                              />
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                {contactType === 'whatsapp' ? (
                                  <MessageCircle className="w-4 h-4" />
                                ) : (
                                  <Mail className="w-4 h-4" />
                                )}
                              </span>
                            </div>
                            {contactType === 'whatsapp' && (
                              <p className="text-xs text-gray-500">
                                Enter your phone number with or without country code. 
                                Examples: 0712345678, 254712345678
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        if (userContact) {
                          if (contactType === 'whatsapp') {
                            handleGetDirections('whatsapp');
                          } else {
                            handleGetDirections('email');
                          }
                        } else {
                          handleGetDirections('map');
                        }
                        setShowDirectionsMenu(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 text-left"
                    >
                      <Car className="w-4 h-4 text-amber-600" />
                      Show on map
                    </button>

                    {userContact && (
                      <button
                        onClick={() => {
                          if (contactType === 'whatsapp') {
                            handleGetDirections('whatsapp');
                          } else {
                            handleGetDirections('email');
                          }
                          setShowDirectionsMenu(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 text-left border-t"
                      >
                        {contactType === 'whatsapp' ? (
                          <>
                            <MessageCircle className="w-4 h-4 text-green-600" />
                            Send to WhatsApp
                          </>
                        ) : (
                          <>
                            <Mail className="w-4 h-4 text-blue-600" />
                            Send to Email
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => {
                        handleGetDirections('taxi');
                        setShowDirectionsMenu(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 text-left border-t"
                    >
                      <Car className="w-4 h-4 text-yellow-600" />
                      Book a Taxi
                    </button>

                    {(showDirections || directionsInfo) && (
                      <button
                        onClick={() => {
                          resetDirections();
                          setUserContact('');
                          setShowDirectionsMenu(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 text-left border-t text-red-600"
                      >
                        Reset Directions
                      </button>
                    )}
                  </div>
                )}

                {successMessage && (
                  <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <p>{successMessage}</p>
                  </div>
                )}

                {directionsError && (
                  <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                    <p>{directionsError}</p>
                    {directionsError.includes('manually') && (
                      <button
                        onClick={() => setShowLocationSearch(true)}
                        className="text-amber-600 hover:text-amber-700 font-medium mt-1"
                      >
                        Enter Location
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-bold mb-4">Nearby Attractions</h3>
              <ul className="space-y-2 text-gray-600">
                {nearbyPlaces.map((place) => {
                  const Icon = place.icon;
                  return (
                    <li key={place.name} className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-amber-600" />
                      {place.name} ({place.duration})
                    </li>
                  );
                })}
                <li className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  Central Business District (20 min)
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-[400px] rounded-lg overflow-hidden shadow-lg">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={14}
                options={mapOptions}
                onLoad={onMapLoad}
              >
                {/* Main Hotel Marker */}
                <MarkerF 
                  position={center}
                  title="Taarifa Suites"
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    scaledSize: new google.maps.Size(40, 40)
                  }}
                  onClick={() => {
                    setSelectedPlace(null);
                    setShowInfoWindow(true);
                  }}
                />
                
                {/* Nearby Places Markers */}
                {nearbyPlaces.map((place) => (
                  <MarkerF
                    key={place.name}
                    position={place.position}
                    title={place.name}
                    icon={{
                      url: place.iconUrl,
                      scaledSize: new google.maps.Size(32, 32)
                    }}
                    onClick={() => {
                      setSelectedPlace(place);
                      setShowInfoWindow(true);
                    }}
                  />
                ))}

                {/* Info Windows */}
                {showInfoWindow && !selectedPlace && (
                  <InfoWindow
                    position={center}
                    onCloseClick={() => setShowInfoWindow(false)}
                  >
                    <div className="p-2">
                      <h3 className="font-bold mb-1">Taarifa Suites</h3>
                      <p className="text-sm text-gray-600">Ojiji Road, Parklands</p>
                      <button
                        onClick={() => {
                          handleGetDirections('map');
                          setShowDirectionsMenu(false);
                        }}
                        className="mt-2 flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
                      >
                        <Car className="w-4 h-4" />
                        Get Directions
                      </button>
                    </div>
                  </InfoWindow>
                )}

                {showInfoWindow && selectedPlace && (
                  <InfoWindow
                    position={selectedPlace.position}
                    onCloseClick={() => setShowInfoWindow(false)}
                  >
                    <div className="p-2">
                      <h3 className="font-bold mb-1">{selectedPlace.name}</h3>
                      <p className="text-sm text-gray-600">{selectedPlace.duration} drive</p>
                    </div>
                  </InfoWindow>
                )}

                {/* Directions Renderer */}
                {directions && showDirections && (
                  <DirectionsRenderer
                    directions={directions}
                    options={{
                      suppressMarkers: false,
                      polylineOptions: {
                        strokeColor: "#d97706",
                        strokeWeight: 5
                      }
                    }}
                  />
                )}
              </GoogleMap>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}