# Dental Center Management System

A comprehensive web-based dental center management system built with React, TypeScript, and Tailwind CSS. This application provides separate interfaces for dental administrators and patients to manage appointments, patient records, and treatment history.

## 🚀 Features

### Admin Features
- **Dashboard Overview**: Real-time statistics and insights
- **Patient Management**: Add, edit, and manage patient records
- **Appointment Scheduling**: Create and manage appointments with detailed information
- **Calendar View**: Visual calendar interface for appointment scheduling
- **Treatment Tracking**: Monitor treatment progress and status
- **File Attachments**: Upload and manage patient documents and images
- **Revenue Tracking**: Monitor financial metrics and patient spending

### Patient Features
- **Personal Dashboard**: View personal health information and statistics
- **Appointment History**: Access complete treatment history
- **Upcoming Appointments**: View scheduled appointments
- **Document Access**: Download treatment-related files and documents
- **Treatment Details**: View detailed treatment information and costs

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Date Handling**: date-fns
- **Charts**: Recharts
- **Build Tool**: Vite
- **Storage**: Local Storage (for demo purposes)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/saiharshit2383/Dental-Clinic.git
   cd dental-center-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔐 Demo Accounts

The application comes with pre-configured demo accounts:

### Admin Account
- **Email**: `admin@entnt.in`
- **Password**: `admin123`
- **Access**: Full administrative privileges

### Patient Accounts
- **Email**: `john@entnt.in` / **Password**: `patient123`
- **Email**: `jane@entnt.in` / **Password**: `patient123`
- **Access**: Patient-specific dashboard and appointments

## 📱 Application Structure

```
src/
├── components/
│   ├── Appointments/          # Appointment management components
│   ├── Auth/                  # Authentication components
│   ├── Calendar/              # Calendar view components
│   ├── Dashboard/             # Dashboard components
│   ├── Layout/                # Layout and navigation
│   ├── Patient/               # Patient-specific components
│   └── Patients/              # Patient management components
├── contexts/                  # React contexts for state management
├── types/                     # TypeScript type definitions
└── utils/                     # Utility functions
```

## 🎯 Key Components

### Authentication System
- Role-based access control (Admin/Patient)
- Secure login with session management
- Protected routes based on user roles

### Patient Management
- Complete patient profiles with health information
- Contact details and emergency contacts
- Treatment history and statistics

### Appointment System
- Comprehensive appointment scheduling
- Status tracking (Scheduled, Completed, Pending, Cancelled)
- File attachments for treatment documentation
- Cost tracking and billing information

### Calendar Integration
- Monthly calendar view
- Color-coded appointment status
- Quick appointment details and navigation

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📊 Data Management

The application uses local storage for data persistence in demo mode. The data structure includes:

- **Users**: Authentication and role information
- **Patients**: Complete patient profiles and health records
- **Incidents**: Appointment and treatment records with file attachments

## 🎨 UI/UX Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern Interface**: Clean, professional design with intuitive navigation
- **Interactive Elements**: Hover states, transitions, and micro-interactions
- **Accessibility**: Proper contrast ratios and keyboard navigation
- **Status Indicators**: Color-coded status badges and progress indicators

## 🔒 Security Features

- Role-based access control
- Protected routes
- Session management
- Input validation and sanitization

## 🙏 Acknowledgments

- Built with modern React best practices
- Designed with healthcare workflow considerations
- Inspired by leading dental practice management systems

---

