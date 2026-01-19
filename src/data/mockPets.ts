import { User } from '../App';

export interface Reminder {
  id: string;
  title: string;
  date: string; // ISO date
  type: 'vaccination' | 'grooming' | 'vet' | 'medication' | 'other';
  isCompleted: boolean;
  recurring?: 'monthly' | 'yearly' | 'none';
}

export interface MedicalRecord {
  id: string;
  date: string;
  title: string;
  description: string;
  vetName?: string;
  attachments?: string[];
}

export interface NutritionItem {
  id: string;
  name: string;
  type: 'food' | 'treat' | 'other';
  image?: string;
  link?: string; // Where to buy
  dailyAmount?: string; // e.g. "200g"
  notes?: string;
  likes?: boolean; // true = likes, false = dislikes, undefined = neutral
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  species: 'dog' | 'cat' | 'other';
  gender: 'male' | 'female';
  birthDate: string; // ISO date
  weight: number; // kg
  chipNumber?: string;
  image: string;
  coverImage?: string;
  owners: User[]; // List of owners (co-owners)
  reminders: Reminder[];
  medicalHistory: MedicalRecord[];
  nutrition: NutritionItem[];
  weightHistory: { date: string; weight: number }[];
  bio?: string;
  traits?: string[];
  pendingInvites?: { email: string; sentAt: Date; role: 'admin' | 'user' | 'sitter' }[];
  parasiteControl?: {
    fleaTick?: {
      lastDate: string;
      product: string;
      expiresAt: string;
    };
    worming?: {
      lastDate: string;
      product: string;
      expiresAt: string;
    };
  };
  walkHistory?: {
    id: string;
    date: string;
    duration: number; // seconds
    distance: number; // meters
    path?: [number, number][]; // simplified path
    participants: string[]; // pet IDs
  }[];
}

export const mockPets: Pet[] = [
  {
    id: '1',
    name: 'Rukis',
    breed: 'Mix', 
    species: 'dog',
    gender: 'male',
    birthDate: '2020-05-15',
    weight: 12.5,
    chipNumber: '749414521452',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    owners: [
      {
        id: 'currentUser',
        username: 'Tomas',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80',
        role: 'admin',
        isOnline: true
      }
    ],
    pendingInvites: [
      { email: 'mama@example.com', sentAt: new Date(Date.now() - 86400000), role: 'sitter' } // 1 day ago
    ],
    parasiteControl: {
      fleaTick: {
        lastDate: '2025-12-15',
        product: 'Simparica Trio',
        expiresAt: '2026-01-15'
      },
      worming: {
        lastDate: '2025-10-01',
        product: 'Drontal',
        expiresAt: '2026-01-01'
      }
    },
    nutrition: [
      {
        id: 'n1',
        name: 'Royal Canin Medium Adult',
        type: 'food',
        image: 'https://images.unsplash.com/photo-1589924691195-41432c84c161?q=80&w=800',
        dailyAmount: '250g',
        likes: true,
        link: 'https://zoovet.lt'
      },
      {
        id: 'n2',
        name: 'Rabbit Ears',
        type: 'treat',
        image: 'https://images.unsplash.com/photo-1582798358481-d199fb7347bb?q=80&w=800',
        notes: 'Only one per week',
        likes: true
      }
    ],
    weightHistory: [
      { date: '2025-09-01', weight: 11.2 },
      { date: '2025-10-01', weight: 11.5 },
      { date: '2025-11-01', weight: 11.8 },
      { date: '2025-12-01', weight: 12.2 },
      { date: '2026-01-01', weight: 12.5 }
    ],
    reminders: [
      {
        id: 'r1',
        title: 'Rabies Vaccination',
        date: '2026-06-15',
        type: 'vaccination',
        isCompleted: false,
        recurring: 'yearly'
      },
      {
        id: 'r2',
        title: 'Monthly Deworming',
        date: '2026-02-01',
        type: 'medication',
        isCompleted: false,
        recurring: 'monthly'
      }
    ],
    medicalHistory: [
      {
        id: 'm1',
        date: '2025-11-10',
        title: 'Annual Checkup',
        description: 'Healthy, weight is stable. Teeth cleaning recommended next visit.',
        vetName: 'Dr. Petkus'
      }
    ],
    walkHistory: [
      {
        id: 'w1',
        date: '2026-01-12T10:30:00',
        duration: 3600, // 1 hour
        distance: 4500, // 4.5 km
        participants: ['1'],
      },
      {
        id: 'w2',
        date: '2026-01-10T14:15:00',
        duration: 1800, // 30 min
        distance: 2100, // 2.1 km
        participants: ['1', '3'],
      }
    ],
    bio: 'Energetic and friendly. Loves playing fetch and stealing socks.',
    traits: ['Friendly', 'Vaccinated', 'Good with kids', 'House trained']
  },
  {
    id: '2',
    name: 'Luna',
    breed: 'Siamese',
    species: 'cat',
    gender: 'female',
    birthDate: '2023-08-20',
    weight: 4.2,
    chipNumber: '9821457821',
    image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    owners: [
      {
        id: 'currentUser',
        username: 'Tomas',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80',
        role: 'user',
        isOnline: true
      },
      {
        id: 'otherUser',
        username: 'Greta',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
        role: 'user',
        isOnline: false
      }
    ],
    pendingInvites: [],
    nutrition: [],
    weightHistory: [
      { date: '2025-08-20', weight: 0.8 },
      { date: '2025-10-20', weight: 2.5 },
      { date: '2025-12-20', weight: 3.8 },
      { date: '2026-01-10', weight: 4.2 }
    ],
    reminders: [], // No reminders -> All caught up
    medicalHistory: []
  },
  {
    id: '3',
    name: 'Milo',
    breed: 'Golden Retriever',
    species: 'dog',
    gender: 'male',
    birthDate: '2025-01-10',
    weight: 28.4,
    chipNumber: '123456789',
    image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?q=80&w=800&auto=format&fit=crop',
    owners: [
      {
        id: 'currentUser',
        username: 'Tomas',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80',
        role: 'user',
        isOnline: true
      }
    ],
    nutrition: [],
    weightHistory: [],
    reminders: [
      {
        id: 'r4',
        title: 'Vet Appointment',
        date: '2026-01-15', // Upcoming very soon
        type: 'vet',
        isCompleted: false
      }
    ],
    medicalHistory: []
  }
];