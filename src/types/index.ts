export interface User {
  id: string;
  role: 'Admin' | 'Patient';
  email: string;
  password: string;
  patientId?: string;
  name?: string;
}

export interface Patient {
  id: string;
  name: string;
  dob: string;
  contact: string;
  email: string;
  address: string;
  healthInfo: string;
  emergencyContact: string;
  createdAt: string;
}

export interface Incident {
  id: string;
  patientId: string;
  title: string;
  description: string;
  comments: string;
  appointmentDate: string;
  cost?: number;
  treatment?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Pending';
  nextDate?: string;
  files: FileAttachment[];
  createdAt: string;
}

export interface FileAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface AppData {
  users: User[];
  patients: Patient[];
  incidents: Incident[];
}