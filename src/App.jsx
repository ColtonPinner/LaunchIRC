import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import AppLayout from '@/components/layout/AppLayout';
import Home from '@/pages/Home';
import Survey from '@/pages/Survey';
import Checklist from '@/pages/Checklist';
import Guides from '@/pages/Guides';
import Directory from '@/pages/Directory';
import DirectoryJoin from '@/pages/DirectoryJoin';
import Concierge from '@/pages/Concierge';
import Sponsor from '@/pages/Sponsor';
import Events from '@/pages/Events';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Disclaimer from '@/pages/Disclaimer';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Inquiries from '@/pages/Inquiries';
import CustomerPortal from '@/pages/CustomerPortal';
import ProviderPortal from '@/pages/ProviderPortal';
import ProviderContact from '@/pages/ProviderContact';
import ProfessionalAuth from '@/pages/ProfessionalAuth';
import ConsultantAuth from '@/pages/ConsultantAuth';
import ConsultantDashboard from '@/pages/ConsultantDashboard';
import AccountAccess from '@/pages/AccountAccess';
import { Navigate } from 'react-router-dom';

const AccountPage = ({ type, children }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to={`/${type}/login`} replace />;
  return user?.account_type === type ? children : <Navigate to="/account" replace />;
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/account" element={<AccountAccess />} />
      <Route path="/customer/login" element={<Login />} />
      <Route path="/customer/register" element={<Register />} />
      <Route path="/provider/login" element={<ProfessionalAuth mode="login" />} />
      <Route path="/provider/register" element={<ProfessionalAuth mode="register" />} />
      <Route path="/consultant/login" element={<ConsultantAuth />} />
      <Route path="/professional/login" element={<Navigate to="/account" replace />} />
      <Route path="/professional/register" element={<Navigate to="/provider/register" replace />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="/directory" element={<Directory />} />
        <Route path="/directory/:id/contact" element={<ProviderContact />} />
        <Route path="/directory/join" element={<AccountPage type="provider"><DirectoryJoin /></AccountPage>} />
        <Route path="/concierge" element={<Concierge />} />
        <Route path="/sponsor" element={<Sponsor />} />
        <Route path="/events" element={<Events />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/checklist" element={<Checklist />} />
        <Route path="/dashboard" element={<AccountPage type="customer"><Dashboard /></AccountPage>} />
        <Route path="/portal" element={<AccountPage type="customer"><CustomerPortal /></AccountPage>} />
        <Route path="/provider" element={<AccountPage type="provider"><ProviderPortal /></AccountPage>} />
        <Route path="/consultant" element={<AccountPage type="consultant"><ConsultantDashboard /></AccountPage>} />
        <Route path="/staff/inquiries" element={<AccountPage type="consultant"><Inquiries /></AccountPage>} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App