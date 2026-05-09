
import './App.css'
import { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { FavoriteProvider } from './context/FavoriteContext'
import { OrderProvider } from './context/OrderContext'
import { ProductProvider } from './context/ProductContext'
import Header from './Component/Header'
import HomeMain from './Component/Home/HomeMain'
import Login from './Component/Login'
import Signup from './Component/Signup'
import OrderHistory from './Component/OrderHistory'
import MedicalProducts from './Component/MedicalProducts'
import AdminPanel from './Component/AdminPanel'
import Footer from './Component/Footer'
import CartDrawer from './Component/CartDrawer'
import CheckoutModal from './Component/CheckoutModal'
import FloatingCartBar from './Component/FloatingCartBar'

function AppContent() {
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [currentView, setCurrentView] = useState<'home' | 'medicine' | 'admin' | 'orders'>('home')
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      if (currentView === 'orders' || currentView === 'admin') {
        setCurrentView('home')
      }
    }
  }, [isAuthenticated, currentView])

  const handleLoginClick = () => {
    setShowSignup(false)
    setShowLogin(true)
  }

  const handleSignupClick = () => {
    setShowLogin(false)
    setShowSignup(true)
  }

  const handleOrdersClick = () => {
    if (!isAuthenticated) {
      setShowLogin(true)
      return
    }
    setCurrentView('orders')
  }

  const handleMenuClick = (menu: string) => {
    if (menu === 'Medicine') {
      setCurrentView('medicine')
    } else if (menu === 'Admin' && user?.role === 'admin') {
      setCurrentView('admin')
    } else if (menu === 'Home') {
      setCurrentView('home')
    } else {
      setCurrentView('home')
    }
  }

  const handleLoginSuccess = () => {
    setShowLogin(false)
    setShowSignup(false)
    setCurrentView('home')
  }

  const handleSignupSuccess = () => {
    setShowLogin(false)
    setShowSignup(false)
    setCurrentView('home')
  }

  const handleCheckout = () => {
    setShowCart(false)
    if (!isAuthenticated) {
      setShowLogin(true)
      return
    }
    setShowCheckout(true)
  }

  const handleShopNow = () => {
    setCurrentView('medicine')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeMain onShopNow={handleShopNow} onOpenCart={() => setShowCart(true)} />
      case 'medicine':
        return <MedicalProducts />
      case 'admin':
        return <AdminPanel />
      case 'orders':
        return <OrderHistory onBack={() => setCurrentView('home')} />
      default:
        return <HomeMain onShopNow={handleShopNow} onOpenCart={() => setShowCart(true)} />
    }
  }

  return (
    <>
      <Header
        onLoginClick={handleLoginClick}
        onOrdersClick={handleOrdersClick}
        onMenuClick={handleMenuClick}
        onCartClick={() => setShowCart(true)}
      />

      {showLogin && (
        <Login onSuccess={handleLoginSuccess} onClose={() => setShowLogin(false)} onSwitchToSignup={handleSignupClick} />
      )}

      {showSignup && (
        <Signup onSuccess={handleSignupSuccess} onClose={() => setShowSignup(false)} onSwitchToLogin={handleLoginClick} />
      )}

      <CartDrawer
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
      />

      {renderCurrentView()}

      <FloatingCartBar onOpenCart={() => setShowCart(true)} />

      <Footer />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <FavoriteProvider>
          <OrderProvider>
            <AppContent />
          </OrderProvider>
        </FavoriteProvider>
      </ProductProvider>
    </AuthProvider>
  )
}

export default App
