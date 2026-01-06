
import { Ride, Booking, User, ImpactStats } from '../types';

const STORAGE_KEYS = {
  RIDES: 'ecoride_rides',
  BOOKINGS: 'ecoride_bookings',
  SESSION: 'ecoride_session',
  USERS: 'ecoride_all_users',
};

const INITIAL_USERS: User[] = [
  {
    id: 'user_in_123',
    name: 'Arjun Mehta',
    email: 'arjun@example.com',
    password: 'password123',
    avatar: 'https://i.pravatar.cc/150?u=arjun',
    rating: 4.8,
    verified: true,
    totalKm: 1250,
    totalCarbonSaved: 250.5
  }
];

export const backendService = {
  // --- Auth Management ---
  getAllUsers(): User[] {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(stored);
  },

  signup(name: string, email: string, password: string): User {
    const users = this.getAllUsers();
    if (users.find(u => u.email === email)) {
      throw new Error("Email already registered");
    }
    const newUser: User = {
      id: `u_${Date.now()}`,
      name,
      email,
      password,
      avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(name)}`,
      rating: 5.0,
      verified: true,
      totalKm: 0,
      totalCarbonSaved: 0
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.createSession(newUser);
    return newUser;
  },

  login(email: string, password: string): User {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error("Invalid email or password");
    }
    this.createSession(user);
    return user;
  },

  createSession(user: User) {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    window.location.reload();
  },

  getCurrentUser(): User | null {
    const stored = localStorage.getItem(STORAGE_KEYS.SESSION);
    return stored ? JSON.parse(stored) : null;
  },

  // --- Ride Management ---
  getRides(): Ride[] {
    const stored = localStorage.getItem(STORAGE_KEYS.RIDES);
    return stored ? JSON.parse(stored) : [];
  },

  offerRide(rideData: Omit<Ride, 'id' | 'status' | 'carbonSavedKg'>): Ride {
    const rides = this.getRides();
    const carbonSaved = rideData.distanceKm * 0.2; 
    
    const newRide: Ride = {
      ...rideData,
      id: `ride_${Date.now()}`,
      status: 'active',
      carbonSavedKg: parseFloat(carbonSaved.toFixed(2))
    };
    
    rides.push(newRide);
    localStorage.setItem(STORAGE_KEYS.RIDES, JSON.stringify(rides));
    return newRide;
  },

  bookRide(rideId: string): boolean {
    const rides = this.getRides();
    const rideIndex = rides.findIndex(r => r.id === rideId);
    const user = this.getCurrentUser();

    if (user && rideIndex > -1 && rides[rideIndex].availableSeats > 0) {
      rides[rideIndex].availableSeats -= 1;
      localStorage.setItem(STORAGE_KEYS.RIDES, JSON.stringify(rides));

      const bookings = this.getBookings();
      bookings.push({
        id: `book_${Date.now()}`,
        rideId,
        passengerId: user.id,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

      // Update user stats in global storage
      const allUsers = this.getAllUsers();
      const uIdx = allUsers.findIndex(u => u.id === user.id);
      if (uIdx > -1) {
        allUsers[uIdx].totalKm = (allUsers[uIdx].totalKm || 0) + rides[rideIndex].distanceKm;
        allUsers[uIdx].totalCarbonSaved = (allUsers[uIdx].totalCarbonSaved || 0) + rides[rideIndex].carbonSavedKg;
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
        // Sync current session
        this.createSession(allUsers[uIdx]);
      }
      
      return true;
    }
    return false;
  },

  getBookings(): Booking[] {
    const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return stored ? JSON.parse(stored) : [];
  },

  getStats(): ImpactStats {
    const user = this.getCurrentUser();
    if (!user) return { totalCarbonSaved: 0, totalKmShared: 0, totalMoneySaved: 0, tripsCount: 0 };
    
    const bookings = this.getBookings().filter(b => b.passengerId === user.id);
    const rides = this.getRides().filter(r => r.driverId === user.id);
    
    return {
      totalCarbonSaved: user.totalCarbonSaved || 0,
      totalKmShared: user.totalKm || 0,
      totalMoneySaved: (bookings.length + rides.length) * 120,
      tripsCount: bookings.length + rides.length
    };
  }
};
