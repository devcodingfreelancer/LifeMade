
import './App.css'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
import ContactUs from './Component/ContactUs'
import Wishlist from './Component/Wishlist'
import ProfilePage from './Component/ProfilePage'
import ForgotPassword from './Component/ForgotPassword'
import SearchResults from './Component/SearchResults'

type ViewType = 'home' | 'medicine' | 'admin' | 'orders' | 'contact' | 'wishlist' | 'profile' | 'search'

function AppContent() {
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [currentView, setCurrentView] = useState<ViewType>('home')
  const [searchQuery, setSearchQuery] = useState('')
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      if (currentView === 'orders' || currentView === 'admin' || currentView === 'profile' || currentView === 'wishlist') {
        setCurrentView('home')
      }
    }
  }, [isAuthenticated, currentView])

  const handleLoginClick = () => {
    setShowSignup(false)
    setShowForgotPassword(false)
    setShowLogin(true)
  }

  const handleSignupClick = () => {
    setShowLogin(false)
    setShowSignup(true)
  }

  const handleForgotPassword = () => {
    setShowLogin(false)
    setShowForgotPassword(true)
  }

  const handleOrdersClick = () => {
    if (!isAuthenticated) {
      setShowLogin(true)
      return
    }
    setCurrentView('orders')
  }

  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      setShowLogin(true)
      return
    }
    setCurrentView('wishlist')
  }

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      setShowLogin(true)
      return
    }
    setCurrentView('profile')
  }

  const handleSearchView = (query: string) => {
    setSearchQuery(query)
    setCurrentView('search')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleMenuClick = (menu: string) => {
    if (menu === 'Medicine') {
      setCurrentView('medicine')
    } else if (menu === 'Admin' && user?.role === 'admin') {
      setCurrentView('admin')
    } else if (menu === 'Home') {
      setCurrentView('home')
    } else if (menu === 'Contact Us') {
      setCurrentView('contact')
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
        return <HomeMain onShopNow={handleShopNow} />
      case 'medicine':
        return <MedicalProducts />
      case 'admin':
        return <AdminPanel />
      case 'orders':
        return <OrderHistory onBack={() => setCurrentView('home')} />
      case 'contact':
        return <ContactUs />
      case 'wishlist':
        return <Wishlist onGoShopping={handleShopNow} />
      case 'profile':
        return (
          <ProfilePage
            onWishlistClick={() => setCurrentView('wishlist')}
            onOrdersClick={handleOrdersClick}
          />
        )
      case 'search':
        return (
          <SearchResults
            initialQuery={searchQuery}
            onBack={() => setCurrentView('home')}
          />
        )
      default:
        return <HomeMain onShopNow={handleShopNow} />
    }
  }

  return (
    <>
      <Header
        onLoginClick={handleLoginClick}
        onOrdersClick={handleOrdersClick}
        onMenuClick={handleMenuClick}
        onCartClick={() => setShowCart(true)}
        onWishlistClick={handleWishlistClick}
        onProfileClick={handleProfileClick}
        onSearchView={handleSearchView}
      />

      {/* ── Modals (login / signup / forgot pw) ── */}
      <AnimatePresence>
        {showLogin && (
          <Login
            key="login"
            onSuccess={handleLoginSuccess}
            onClose={() => setShowLogin(false)}
            onSwitchToSignup={handleSignupClick}
            onForgotPassword={handleForgotPassword}
          />
        )}
        {showSignup && (
          <Signup key="signup" onSuccess={handleSignupSuccess} onClose={() => setShowSignup(false)} onSwitchToLogin={handleLoginClick} />
        )}
        {showForgotPassword && (
          <ForgotPassword
            key="forgot"
            onClose={() => setShowForgotPassword(false)}
            onBackToLogin={() => {
              setShowForgotPassword(false)
              setShowLogin(true)
            }}
          />
        )}
      </AnimatePresence>

      <CartDrawer
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
      />

      {/* ── Page views with slide-in transition ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {renderCurrentView()}
        </motion.div>
      </AnimatePresence>

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
