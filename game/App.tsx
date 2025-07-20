
import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { useAppContext } from './hooks/useAppContext';
import Header from './components/Header';
import UserHome from './components/UserHome';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Instructions from './components/Instructions';

// Layout for the main user-facing page
const UserLayout: React.FC = () => (
    <>
        <Header />
        <main className="flex-grow p-4 md:p-6">
            <div className="max-w-6xl mx-auto space-y-8">
                <Instructions />
                <UserHome />
            </div>
        </main>
    </>
);

// A component to protect admin routes
const AdminRouteGuard: React.FC = () => {
    const { state } = useAppContext();
    // Outlet will render the nested child route (AdminDashboard) if admin is logged in
    return state.isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Routes>
                <Route path="/login" element={<AdminLogin />} />

                {/* Protected Admin Routes */}
                <Route element={<AdminRouteGuard />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                </Route>

                {/* Main User Route */}
                <Route path="/" element={<UserLayout />} />
            </Routes>
        </div>
    );
}

const App: React.FC = () => {
    return (
        <AppProvider>
            <HashRouter>
                <AppRoutes />
            </HashRouter>
        </AppProvider>
    );
};

export default App;
