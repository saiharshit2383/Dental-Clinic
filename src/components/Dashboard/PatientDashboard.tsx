import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { format, isAfter } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  FileText, 
  AlertCircle,
  CheckCircle,
  User,
  Phone,
  Mail
} from 'lucide-react';

const PatientDashboard: React.FC = () => {
  const { patients, incidents } = useData();
  const { user } = useAuth();

  const currentPatient = patients.find(p => p.id === user?.patientId);
  const patientIncidents = incidents.filter(inc => inc.patientId === user?.patientId);

  const upcomingAppointments = patientIncidents
    .filter(inc => isAfter(new Date(inc.appointmentDate), new Date()))
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());

  const completedTreatments = patientIncidents.filter(inc => inc.status === 'Completed');
  const totalSpent = completedTreatments.reduce((sum, inc) => sum + (inc.cost || 0), 0);

  const nextAppointment = upcomingAppointments[0];

  if (!currentPatient) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <p className="text-gray-500">Patient data not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {currentPatient.name}</h1>
          <p className="text-gray-600">Your dental care dashboard</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-lg font-semibold text-gray-900">
            {format(new Date(), 'MMMM dd, yyyy')}
          </p>
        </div>
      </div>

      {/* Patient Info Card */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Date of Birth</p>
              <p className="font-medium text-gray-900">
                {format(new Date(currentPatient.dob), 'MMMM dd, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium text-gray-900">{currentPatient.contact}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{currentPatient.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Health Info</p>
              <p className="font-medium text-gray-900">{currentPatient.healthInfo}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-500">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Treatments</p>
              <p className="text-2xl font-bold text-gray-900">{completedTreatments.length}</p>
            </div>
            <div className="p-3 rounded-full bg-green-500">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">${totalSpent.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-500">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Next Appointment */}
      {nextAppointment && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Next Appointment</h3>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900">{nextAppointment.title}</h4>
              <p className="text-blue-700 mt-1">{nextAppointment.description}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700">
                    {format(new Date(nextAppointment.appointmentDate), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700">
                    {format(new Date(nextAppointment.appointmentDate), 'h:mm a')}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {nextAppointment.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Treatments */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Treatment History</h3>
        <div className="space-y-4">
          {completedTreatments.slice(0, 5).map((treatment) => (
            <div key={treatment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{treatment.title}</h4>
                <p className="text-sm text-gray-600">{treatment.treatment}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {format(new Date(treatment.appointmentDate), 'MMM dd, yyyy')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  ${treatment.cost?.toLocaleString() || 'N/A'}
                </p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {treatment.status}
                </span>
              </div>
            </div>
          ))}
          {completedTreatments.length === 0 && (
            <p className="text-gray-500 text-center py-4">No treatment history available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;