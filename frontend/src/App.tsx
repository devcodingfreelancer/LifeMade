import './App.css'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
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

function AppContent() {
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { isAuthenticated, user } = useAuth()
  
  const navigate = useNavigate()
  const location = useLocation()

  // Protect routes that require authentication
  useEffect(() => {
    if (!isAuthenticated) {
      const protectedPaths = ['/orders', '/admin', '/profile', '/wishlist'];
      if (protectedPaths.some(path => location.pathname.startsWith(path))) {
        navigate('/')
        setShowLogin(true)
      }
    } else if (location.pathname.startsWith('/admin') && user?.role !== 'admin') {
      navigate('/')
    }
  }, [isAuthenticated, location.pathname, navigate, user?.role])

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
    if (user?.role === 'admin') {
      navigate('/admin/users')
    } else {
      navigate('/orders')
    }
  }

  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      setShowLogin(true)
      return
    }
    navigate('/wishlist')
  }

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      setShowLogin(true)
      return
    }
    navigate('/profile')
  }

  const handleSearchView = (query: string) => {
    setSearchQuery(query)
    navigate(`/search?q=${encodeURIComponent(query)}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleMenuClick = (menu: string) => {
    if (menu === 'Medicine') {
      navigate('/products')
    } else if (menu === 'Admin' && user?.role === 'admin') {
      navigate('/admin')
    } else if (menu === 'Home') {
      navigate('/')
    } else if (menu === 'Contact Us') {
      navigate('/contactus')
    } else {
      navigate('/')
    }
  }

  const handleLoginSuccess = () => {
    setShowLogin(false)
    setShowSignup(false)
    if (user?.role === 'admin') {
      navigate('/admin')
    } else {
      navigate('/')
    }
  }

  const handleSignupSuccess = () => {
    setShowLogin(false)
    setShowSignup(false)
    navigate('/')
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
    navigate('/products')
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomeMain onShopNow={handleShopNow} />} />
            <Route path="/products" element={<MedicalProducts />} />
            <Route path="/admin/*" element={user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
            <Route path="/orders" element={<OrderHistory onBack={() => navigate('/')} />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/wishlist" element={<Wishlist onGoShopping={handleShopNow} />} />
            <Route path="/profile" element={
              <ProfilePage
                onWishlistClick={() => navigate('/wishlist')}
                onOrdersClick={handleOrdersClick}
              />
            } />
            <Route path="/search" element={
              <SearchResults
                initialQuery={searchQuery || new URLSearchParams(location.search).get('q') || ''}
                onBack={() => navigate('/')}
              />
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      <FloatingCartBar onOpenCart={() => setShowCart(true)} />

      <Footer />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <FavoriteProvider>
            <OrderProvider>
              <AppContent />
            </OrderProvider>
          </FavoriteProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
