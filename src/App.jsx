import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { QuickTour } from './components/QuickTour';
import { HomePage } from './pages/HomePage';
import { BrowsePage } from './pages/BrowsePage';
import { CultivarDetailPage } from './pages/CultivarDetailPage';
import { ReviewFormPage } from './pages/ReviewFormPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import './index.css';

function LayoutWrapper() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <QuickTour />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<LayoutWrapper />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/cultivar/:id" element={<CultivarDetailPage />} />
            <Route path="/review/new" element={<ReviewFormPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
