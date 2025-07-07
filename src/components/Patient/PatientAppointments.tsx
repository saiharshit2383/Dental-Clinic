import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { format, isAfter, isBefore } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  FileText, 
  Download,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

const PatientAppointments: React.FC = () => {
  const { incidents } = useData();
  const { user } = useAuth();

  const patientIncidents = incidents.filter(inc => inc.patientId === user?.patientId);
  const now = new Date();

  const upcomingAppointments = patientIncidents
    .filter(inc => isAfter(new Date(inc.appointmentDate), now))
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());

  const pastAppointments = patientIncidents
    .filter(inc => isBefore(new Date(inc.appointmentDate), now))
    .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Scheduled':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'Pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'Cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadFile = (file: any) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
  };

  const AppointmentCard: React.FC<{ appointment: any; isPast: boolean }> = ({ appointment, isPast }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon(appointment.status)}
          <div>
            <h3 className="font-semibold text-gray-900">{appointment.title}</h3>
            <p className="text-sm text-gray-600">{appointment.description}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
          {appointment.status}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{format(new Date(appointment.appointmentDate), 'h:mm a')}</span>
          </div>
          {appointment.cost && (
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4" />
              <span>${appointment.cost.toLocaleString()}</span>
            </div>
          )}
        </div>

        {appointment.comments && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Comments:</span> {appointment.comments}
            </p>
          </div>
        )}

        {appointment.treatment && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Treatment:</span> {appointment.treatment}
            </p>
          </div>
        )}

        {appointment.files && appointment.files.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
            <div className="space-y-2">
              {appointment.files.map((file: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{file.name}</span>
                  </div>
                  <button
                    onClick={() => downloadFile(file)}
                    className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {appointment.nextDate && (
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-800">
              <span className="font-medium">Next Appointment:</span> {format(new Date(appointment.nextDate), 'MMM dd, yyyy h:mm a')}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Calendar className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600">View your appointment history and upcoming visits</p>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
        {upcomingAppointments.length > 0 ? (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} isPast={false} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No upcoming appointments scheduled</p>
          </div>
        )}
      </div>

      {/* Past Appointments */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointment History</h2>
        {pastAppointments.length > 0 ? (
          <div className="space-y-4">
            {pastAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} isPast={true} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No appointment history available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientAppointments;