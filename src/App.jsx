import { useState, useCallback } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Services from './components/Services/Services';
import Gallery from './components/Gallery/Gallery';
import Reviews from './components/Reviews/Reviews';
import Booking from './components/Booking/Booking';
import Footer from './components/Footer/Footer';
import BookingModal from './components/BookingModal/BookingModal';

function AppContent() {
  const { lang } = useLanguage();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [initialService, setInitialService] = useState(null);

  const openBooking = useCallback((service = null) => {
    setInitialService(service);
    setBookingOpen(true);
  }, []);

  const closeBooking = useCallback(() => setBookingOpen(false), []);

  return (
    <div dir={lang === 'en' ? 'ltr' : 'rtl'} lang={lang}>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Gallery />
        <Reviews />
        <Services onOpenBooking={openBooking} />
        <Booking />
      </main>
      <Footer />
      <BookingModal
        isOpen={bookingOpen}
        onClose={closeBooking}
        initialService={initialService}
      />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
