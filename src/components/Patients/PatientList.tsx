import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { format } from 'date-fns';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  Calendar,
  User
} from 'lucide-react';
import PatientForm from './PatientForm';

const PatientList: React.FC = () => {
  const { patients, incidents, deletePatient } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<string | null>(null);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.contact.includes(searchTerm)
  );

  const handleEdit = (patientId: string) => {
    setEditingPatient(patientId);
    setShowForm(true);
  };

  const handleDelete = (patientId: string) => {
    if (window.confirm('Are you sure you want to delete this patient? This will also delete all associated appointments.')) {
      deletePatient(patientId);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPatient(null);
  };

  const getPatientStats = (patientId: string) => {
    const patientIncidents = incidents.filter(inc => inc.patientId === patientId);
    const completedTreatments = patientIncidents.filter(inc => inc.status === 'Completed').length;
    const totalSpent = patientIncidents
      .filter(inc => inc.status === 'Completed' && inc.cost)
      .reduce((sum, inc) => sum + (inc.cost || 0), 0);
    
    return { completedTreatments, totalSpent, totalAppointments: patientIncidents.length };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
            <p className="text-gray-600">{patients.length} patients registered</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Patient</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search patients by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Patient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => {
          const stats = getPatientStats(patient.id);
          return (
            <div key={patient.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                    <p className="text-sm text-gray-500">
                      Born {format(new Date(patient.dob), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(patient.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(patient.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{patient.contact}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{patient.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {stats.totalAppointments} appointments
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Health Information</p>
                <p className="text-sm text-gray-800">{patient.healthInfo}</p>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{stats.completedTreatments}</p>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">${stats.totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Total Spent</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No patients found</p>
        </div>
      )}

      {/* Patient Form Modal */}
      {showForm && (
        <PatientForm
          patientId={editingPatient}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default PatientList;