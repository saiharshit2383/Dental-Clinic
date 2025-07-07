import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { format, isToday, isTomorrow, addDays } from 'date-fns';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Activity, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { patients, incidents } = useData();
  const { user } = useAuth();

  const today = new Date();
  const upcomingAppointments = incidents
    .filter(inc => new Date(inc.appointmentDate) >= today)
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
    .slice(0, 10);

  const completedTreatments = incidents.filter(inc => inc.status === 'Completed').length;
  const pendingTreatments = incidents.filter(inc => inc.status === 'Scheduled' || inc.status === 'Pending').length;
  const totalRevenue = incidents
    .filter(inc => inc.status === 'Completed' && inc.cost)
    .reduce((sum, inc) => sum + (inc.cost || 0), 0);

  const todayAppointments = incidents.filter(inc => 
    isToday(new Date(inc.appointmentDate))
  ).length;

  const topPatients = patients
    .map(patient => ({
      ...patient,
      appointmentCount: incidents.filter(inc => inc.patientId === patient.id).length,
      totalSpent: incidents
        .filter(inc => inc.patientId === patient.id && inc.status === 'Completed' && inc.cost)
        .reduce((sum, inc) => sum + (inc.cost || 0), 0)
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    trend?: string;
  }> = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-lg font-semibold text-gray-900">
            {format(today, 'MMMM dd, yyyy')}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={patients.length}
          icon={Users}
          color="bg-blue-500"
          trend="+12% from last month"
        />
        <StatCard
          title="Today's Appointments"
          value={todayAppointments}
          icon={Calendar}
          color="bg-green-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-purple-500"
          trend="+8% from last month"
        />
        <StatCard
          title="Active Treatments"
          value={pendingTreatments}
          icon={Activity}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
          <div className="space-y-3">
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
            ) : (
              upcomingAppointments.map((appointment) => {
                const patient = patients.find(p => p.id === appointment.patientId);
                const appointmentDate = new Date(appointment.appointmentDate);
                const isToday = format(appointmentDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
                const isTomorrow = format(appointmentDate, 'yyyy-MM-dd') === format(addDays(today, 1), 'yyyy-MM-dd');
                
                return (
                  <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        isToday ? 'bg-red-500' : isTomorrow ? 'bg-orange-500' : 'bg-blue-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{patient?.name}</p>
                        <p className="text-sm text-gray-600">{appointment.title}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {format(appointmentDate, 'MMM dd')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(appointmentDate, 'h:mm a')}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Patients */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Patients</h3>
          <div className="space-y-3">
            {topPatients.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No patient data available</p>
            ) : (
              topPatients.map((patient, index) => (
                <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-600">
                        {patient.appointmentCount} appointments
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ${patient.totalSpent.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Total spent</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Treatment Status Overview */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Treatment Status Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-green-600">{completedTreatments}</p>
              <p className="text-sm text-green-700">Completed</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
            <Clock className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold text-orange-600">{pendingTreatments}</p>
              <p className="text-sm text-orange-700">Pending</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold text-red-600">
                {incidents.filter(inc => inc.status === 'Cancelled').length}
              </p>
              <p className="text-sm text-red-700">Cancelled</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;