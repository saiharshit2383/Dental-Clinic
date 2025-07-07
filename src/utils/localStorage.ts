import { AppData } from '../types';

const STORAGE_KEY = 'dental-center-data';
const SESSION_KEY = 'dental-center-session';

export const getStoredData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Initialize with mock data
  const initialData: AppData = {
    users: [
      { 
        id: '1', 
        role: 'Admin', 
        email: 'admin@entnt.in', 
        password: 'admin123',
        name: 'Dr. Sarah Johnson'
      },
      { 
        id: '2', 
        role: 'Patient', 
        email: 'john@entnt.in', 
        password: 'patient123', 
        patientId: 'p1',
        name: 'John Doe'
      },
      { 
        id: '3', 
        role: 'Patient', 
        email: 'jane@entnt.in', 
        password: 'patient123', 
        patientId: 'p2',
        name: 'Jane Smith'
      }
    ],
    patients: [
      {
        id: 'p1',
        name: 'John Doe',
        dob: '1990-05-10',
        contact: '1234567890',
        email: 'john@entnt.in',
        address: '123 Main St, City, State 12345',
        healthInfo: 'No known allergies. History of cavities.',
        emergencyContact: 'Mary Doe - 0987654321',
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'p2',
        name: 'Jane Smith',
        dob: '1985-08-22',
        contact: '0987654321',
        email: 'jane@entnt.in',
        address: '456 Oak Ave, City, State 12345',
        healthInfo: 'Allergic to penicillin. Regular dental checkups.',
        emergencyContact: 'Bob Smith - 1234567890',
        createdAt: '2024-02-20T14:30:00Z'
      }
    ],
    incidents: [
      {
        id: 'i1',
        patientId: 'p1',
        title: 'Routine Cleaning',
        description: 'Regular dental cleaning and checkup',
        comments: 'Patient showed good oral hygiene',
        appointmentDate: '2024-12-28T10:00:00',
        cost: 120,
        treatment: 'Professional cleaning, fluoride treatment',
        status: 'Completed',
        files: [],
        createdAt: '2024-12-15T09:00:00Z'
      },
      {
        id: 'i2',
        patientId: 'p1',
        title: 'Cavity Filling',
        description: 'Upper molar cavity treatment',
        comments: 'Patient experienced mild sensitivity',
        appointmentDate: '2025-01-15T14:00:00',
        cost: 280,
        treatment: 'Composite filling on upper left molar',
        status: 'Scheduled',
        files: [],
        createdAt: '2024-12-20T11:00:00Z'
      },
      {
        id: 'i3',
        patientId: 'p2',
        title: 'Root Canal Consultation',
        description: 'Consultation for potential root canal treatment',
        comments: 'X-rays show infection in lower premolar',
        appointmentDate: '2025-01-10T09:30:00',
        status: 'Scheduled',
        files: [],
        createdAt: '2024-12-18T16:00:00Z'
      }
    ]
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  return initialData;
};

export const saveData = (data: AppData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getSession = (): string | null => {
  return localStorage.getItem(SESSION_KEY);
};

export const saveSession = (userId: string): void => {
  localStorage.setItem(SESSION_KEY, userId);
};

export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};