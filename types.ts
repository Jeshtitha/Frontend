
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  rating: number;
  verified: boolean;
  totalKm?: number;
  totalCarbonSaved?: number;
  password?: string; // Only for mock storage
}

export interface Ride {
  id: string;
  driverId: string;
  driverName: string;
  driverAvatar: string;
  origin: string;
  destination: string;
  departureTime: string;
  availableSeats: number;
  price: number;
  distanceKm: number;
  carbonSavedKg: number;
  status: 'active' | 'completed' | 'cancelled';
}

export interface Booking {
  id: string;
  rideId: string;
  passengerId: string;
  timestamp: string;
}

export interface ImpactStats {
  totalCarbonSaved: number;
  totalKmShared: number;
  totalMoneySaved: number;
  tripsCount: number;
}
