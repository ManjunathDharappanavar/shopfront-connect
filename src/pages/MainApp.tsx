import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Layout/Header';
import LoginForm from '@/components/Auth/LoginForm';
import RegisterForm from '@/components/Auth/RegisterForm';
import ProductList from '@/components/Products/ProductList';
import CartPage from '@/components/Cart/CartPage';
import OrdersPage from '@/components/Orders/OrdersPage';
import AdminDashboard from '@/components/Admin/AdminDashboard';

const MainApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('products');
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // If user is not logged in, show login page
    if (!isLoading && !user) {
      setCurrentPage('login');
    } else if (!isLoading && user) {
      // If user is logged in and on auth pages, redirect to products
      if (currentPage === 'login' || currentPage === 'register') {
        setCurrentPage('products');
      }
    }
  }, [user, isLoading, currentPage]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
          <p className="text-xl font-medium text-muted-foreground">Loading ShopConnect...</p>
        </div>
      </div>
    );
  }

  // Show auth pages for non-authenticated users
  if (!user) {
    if (currentPage === 'register') {
      return <RegisterForm onNavigate={handleNavigate} />;
    }
    return <LoginForm onNavigate={handleNavigate} />;
  }

  // Main app for authenticated users
  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={handleNavigate} currentPage={currentPage} />
      
      <main className="container mx-auto px-4 py-8">
        {currentPage === 'products' && <ProductList />}
        {currentPage === 'cart' && <CartPage />}
        {currentPage === 'orders' && <OrdersPage />}
        {currentPage === 'admin' && user.isAdmin && <AdminDashboard />}
        
        {/* Fallback for admin-only pages */}
        {currentPage === 'admin' && !user.isAdmin && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-muted-foreground">Access Denied</h2>
            <p className="text-muted-foreground mt-2">You don't have permission to access this page.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MainApp;