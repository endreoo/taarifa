import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  User, 
  CreditCard, 
  Award, 
  Clock, 
  Hotel,
  MapPin,
  Utensils,
  Leaf,
  Flag
} from 'lucide-react';
import MemberBooking from '../components/booking/MemberBooking';

// Dummy data
const userProfile = {
  name: "John Doe",
  email: "john@example.com",
  memberSince: "2023",
  status: "Gold Member",
  points: 2500,
  discountLevel: "7%",
  upcomingMilestone: "150 points to Platinum"
};

const bookings = [
  {
    id: 1,
    hotelName: "Taarifa Suites Parklands",
    checkIn: "2024-04-15",
    checkOut: "2024-04-20",
    roomType: "One Bedroom Suite",
    status: "Upcoming",
    totalAmount: 75000
  },
  {
    id: 2,
    hotelName: "Taarifa Suites Westlands",
    checkIn: "2024-03-01",
    checkOut: "2024-03-03",
    roomType: "Studio Apartment",
    status: "Completed",
    totalAmount: 25000
  },
  {
    id: 3,
    hotelName: "Taarifa Suites Kilimani",
    checkIn: "2024-02-10",
    checkOut: "2024-02-15",
    roomType: "Two Bedroom Suite",
    status: "Completed",
    totalAmount: 95000
  }
];

const activities = [
  {
    id: 1,
    name: "Trip to The National Park",
    description: "Experience Kenya's wildlife in their natural habitat at Nairobi National Park",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801",
    duration: "Full Day",
    price: 15000,
    icon: <MapPin className="w-5 h-5" />
  },
  {
    id: 2,
    name: "Visit to Race Course",
    description: "Witness exciting races at Ngong Racecourse, Kenya's premier horse racing venue",
    image: "/images/activities/racecourse.jpg",
    duration: "Half Day",
    price: 8000,
    icon: <Flag className="w-5 h-5" />
  },
  {
    id: 3,
    name: "Tea Farm Experience",
    description: "Visit a scenic tea plantation and learn about Kenya's famous tea production",
    image: "https://images.unsplash.com/photo-1582450871972-ab5ca641643d",
    duration: "Full Day",
    price: 12000,
    icon: <Leaf className="w-5 h-5" />
  },
  {
    id: 4,
    name: "Extreme Dining Experience",
    description: "Enjoy an unforgettable culinary journey at Nairobi's finest restaurant",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
    duration: "Evening",
    price: 20000,
    icon: <Utensils className="w-5 h-5" />
  }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate progress percentage
  const currentPoints = userProfile.points;
  const nextTierPoints = 3000; // Points needed for next tier
  const progressPercentage = Math.min((currentPoints / nextTierPoints) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Banner */}
      <div className="bg-amber-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {userProfile.name}</h1>
              <p className="mt-1 text-amber-100">
                {userProfile.status} • {userProfile.points} Points
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{userProfile.discountLevel}</div>
              <div className="text-amber-100">Member Discount</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 space-y-2 sticky top-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'overview' ? 'bg-amber-600 text-white' : 'hover:bg-gray-100'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('book')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'book' ? 'bg-amber-600 text-white' : 'hover:bg-gray-100'
                }`}
              >
                Book a Room
              </button>
              <button
                onClick={() => setActiveTab('activities')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'activities' ? 'bg-amber-600 text-white' : 'hover:bg-gray-100'
                }`}
              >
                Activities
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'bookings' ? 'bg-amber-600 text-white' : 'hover:bg-gray-100'
                }`}
              >
                My Bookings
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-grow">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Points Progress */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Points Progress</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>Progress to Platinum</span>
                        <span>{userProfile.upcomingMilestone}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-amber-600 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="text-sm text-gray-500">Current Tier</div>
                        <div className="text-lg font-semibold mt-1">{userProfile.status}</div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="text-sm text-gray-500">Points Balance</div>
                        <div className="text-lg font-semibold mt-1">{userProfile.points}</div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="text-sm text-gray-500">Current Discount</div>
                        <div className="text-lg font-semibold mt-1">{userProfile.discountLevel}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center">
                      <Award className="h-8 w-8 text-amber-600" />
                      <div className="ml-4">
                        <div className="text-sm text-gray-500">Status</div>
                        <div className="text-xl font-semibold">{userProfile.status}</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center">
                      <CreditCard className="h-8 w-8 text-amber-600" />
                      <div className="ml-4">
                        <div className="text-sm text-gray-500">Points Balance</div>
                        <div className="text-xl font-semibold">{userProfile.points}</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-6 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center">
                      <Clock className="h-8 w-8 text-amber-600" />
                      <div className="ml-4">
                        <div className="text-sm text-gray-500">Member Since</div>
                        <div className="text-xl font-semibold">{userProfile.memberSince}</div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Member Benefits */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Member Benefits</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center text-amber-600 mb-2">
                        <Award className="h-5 w-5 mr-2" />
                        <h3 className="font-medium">Exclusive Discounts</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        Enjoy up to 15% off our best available rates across all properties
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center text-amber-600 mb-2">
                        <Clock className="h-5 w-5 mr-2" />
                        <h3 className="font-medium">Early Check-in</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        Subject to availability, check in up to 2 hours early
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center text-amber-600 mb-2">
                        <CreditCard className="h-5 w-5 mr-2" />
                        <h3 className="font-medium">Points Earning</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        Earn 1 point for every KES 100 spent on accommodation
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center text-amber-600 mb-2">
                        <User className="h-5 w-5 mr-2" />
                        <h3 className="font-medium">Member Rates</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        Access to special member-only rates and promotions
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recent Bookings Preview */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">Recent Bookings</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {bookings.slice(0, 2).map((booking) => (
                      <div key={booking.id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center">
                              <Hotel className="h-5 w-5 text-amber-600" />
                              <h3 className="ml-2 text-lg font-medium">{booking.hotelName}</h3>
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                              {booking.checkIn} - {booking.checkOut}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-amber-600">
                              KES {booking.totalAmount.toLocaleString()}
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                              {booking.status}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'book' && (
              <MemberBooking userProfile={userProfile} />
            )}

            {activeTab === 'activities' && (
              <div className="space-y-6">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold text-amber-800">Exclusive Member Activities</h2>
                  <p className="text-sm text-amber-700 mt-1">
                    Earn double points on all activity bookings as a member benefit
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activities.map((activity) => (
                    <div key={activity.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={activity.image} 
                          alt={activity.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-amber-600">{activity.icon}</span>
                          <h3 className="text-lg font-semibold">{activity.name}</h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{activity.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">{activity.duration}</div>
                          <div>
                            <div className="text-sm text-gray-500">From</div>
                            <div className="text-lg font-semibold text-amber-600">
                              KES {activity.price.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <button className="w-full mt-4 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors">
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">My Bookings</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            <Hotel className="h-5 w-5 text-amber-600" />
                            <h3 className="ml-2 text-lg font-medium">{booking.hotelName}</h3>
                          </div>
                          <div className="mt-1 text-sm text-gray-500">
                            {booking.checkIn} - {booking.checkOut}
                          </div>
                          <div className="mt-1 text-sm text-gray-500">
                            {booking.roomType}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-amber-600">
                            KES {booking.totalAmount.toLocaleString()}
                          </div>
                          <div className="mt-1 text-sm text-gray-500">
                            {booking.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 