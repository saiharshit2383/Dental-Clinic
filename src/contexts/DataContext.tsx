import React, { createContext, useContext, useEffect, useState } from 'react';
import { Patient, Incident, AppData } from '../types';
import { getStoredData, saveData } from '../utils/localStorage';

interface DataContextType {
  patients: Patient[];
  incidents: Incident[];
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  addIncident: (incident: Omit<Incident, 'id' | 'createdAt'>) => void;
  updateIncident: (id: string, incident: Partial<Incident>) => void;
  deleteIncident: (id: string) => void;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(() => getStoredData());

  const saveAndUpdate = (newData: AppData) => {
    setData(newData);
    saveData(newData);
  };

  const addPatient = (patient: Omit<Patient, 'id' | 'createdAt'>) => {
    const newPatient: Patient = {
      ...patient,
      id: `p${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const newData = {
      ...data,
      patients: [...data.patients, newPatient]
    };
    saveAndUpdate(newData);
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    const newData = {
      ...data,
      patients: data.patients.map(p => p.id === id ? { ...p, ...updates } : p)
    };
    saveAndUpdate(newData);
  };

  const deletePatient = (id: string) => {
    const newData = {
      ...data,
      patients: data.patients.filter(p => p.id !== id),
      incidents: data.incidents.filter(i => i.patientId !== id)
    };
    saveAndUpdate(newData);
  };

  const addIncident = (incident: Omit<Incident, 'id' | 'createdAt'>) => {
    const newIncident: Incident = {
      ...incident,
      id: `i${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const newData = {
      ...data,
      incidents: [...data.incidents, newIncident]
    };
    saveAndUpdate(newData);
  };

  const updateIncident = (id: string, updates: Partial<Incident>) => {
    const newData = {
      ...data,
      incidents: data.incidents.map(i => i.id === id ? { ...i, ...updates } : i)
    };
    saveAndUpdate(newData);
  };

  const deleteIncident = (id: string) => {
    const newData = {
      ...data,
      incidents: data.incidents.filter(i => i.id !== id)
    };
    saveAndUpdate(newData);
  };

  const refreshData = () => {
    const freshData = getStoredData();
    setData(freshData);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <DataContext.Provider 
      value={{ 
        patients: data.patients, 
        incidents: data.incidents,
        addPatient,
        updatePatient,
        deletePatient,
        addIncident,
        updateIncident,
        deleteIncident,
        refreshData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};