import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ErrorBoundary } from './components/layout/ErrorBoundary';

import { LandingPage } from './pages/LandingPage';

import { Dashboard } from './pages/Dashboard/Dashboard';
import { Calendar } from './pages/Dashboard/Calendar';
import { Transactions } from './pages/Dashboard/Transactions';
import { Accounts } from './pages/Dashboard/Accounts';
import { Budgets } from './pages/Dashboard/Budgets';
import { Categories } from './pages/Dashboard/Categories';
import { Analytics } from './pages/Dashboard/Analytics';
import { Reports } from './pages/Dashboard/Reports';
import { Goals } from './pages/Dashboard/Goals';
import { Notifications } from './pages/Dashboard/Notifications';
import { Profile } from './pages/Dashboard/Profile';
import { Settings } from './pages/Dashboard/Settings';
import { PlaceholderSection } from './components/layout/PlaceholderSection';

// Auth Placeholders & Components
import { Button } from './components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ScheduledTransactionsProvider } from './context/ScheduledTransactionsContext';
import { TransactionsProvider } from './context/TransactionsContext';
import { AccountsProvider } from './context/AccountsContext';
import { BudgetsProvider } from './context/BudgetsContext';
import { CategoriesProvider } from './context/CategoriesContext';
import { GoalsProvider } from './context/GoalsContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { FilterProvider } from './context/FilterContext';
import { NotificationEngine } from './components/layout/NotificationEngine';
import { Login } from './pages/Auth/Login';
import { PhoneLogin } from './pages/Auth/PhoneLogin';
import { VerifyOTP } from './pages/Auth/VerifyOTP';
import { ForgotPassword } from './pages/Auth/ForgotPassword';
import { Register } from './pages/Auth/Register';

function App() {
  return (
    <ErrorBoundary>
      <NotificationsProvider>
        <AuthProvider>
        <AccountsProvider>
          <TransactionsProvider>
          <ScheduledTransactionsProvider>
            <BudgetsProvider>
              <CategoriesProvider>
                <GoalsProvider>
                  <FilterProvider>
                    <NotificationEngine />
                    <BrowserRouter>
                    <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/phone-login" element={<PhoneLogin />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />

                {/* Authenticated Routes */}
                <Route path="/dashboard" element={<AppShell />}>
                  <Route index element={<Dashboard />} />
                  <Route path="accounts" element={<Accounts />} />
                  <Route path="transactions" element={<Transactions />} />
                  <Route path="calendar" element={<Calendar />} />
                  <Route path="budgets" element={<Budgets />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="goals" element={<Goals />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                      </Routes>
                    </BrowserRouter>
                  </FilterProvider>
                </GoalsProvider>
              </CategoriesProvider>
            </BudgetsProvider>
          </ScheduledTransactionsProvider>
        </TransactionsProvider>
      </AccountsProvider>
    </AuthProvider>
    </NotificationsProvider>
    </ErrorBoundary>
  );
}

export default App;
