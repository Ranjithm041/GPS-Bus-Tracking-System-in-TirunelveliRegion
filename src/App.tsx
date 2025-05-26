import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/Layout/Layout';
import LoadingSpinner from './components/UI/LoadingSpinner';
import { NotificationProvider } from './contexts/NotificationContext';
import { BusDataProvider } from './contexts/BusDataContext';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const BusDetailsPage = lazy(() => import('./pages/BusDetailsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <BrowserRouter>
      <BusDataProvider>
        <NotificationProvider>
          <Layout>
            <Suspense fallback={<LoadingSpinner />}>
            <div className="overflow-x-hidden">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/bus/:id" element={<BusDetailsPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </div>
            </Suspense>
          </Layout>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </NotificationProvider>
      </BusDataProvider>
    </BrowserRouter>
  );
}

export default App;