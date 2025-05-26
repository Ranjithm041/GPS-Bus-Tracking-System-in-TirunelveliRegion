import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bus, Map, Info, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../../hooks/useNotification';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { notificationsEnabled, requestNotificationPermission } = useNotification();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const enableNotifications = async () => {
    await requestNotificationPermission();
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center w-full">
          <Link to="/" className="flex items-center space-x-2">
            <Bus className="h-8 w-8 text-primary-500" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Tirunelveli Bus Tracker</h1>
              <p className="text-xs text-gray-600">Real-time GPS tracking system</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink to="/" label="Map" icon={<Map size={18} />} isActive={location.pathname === '/'} />
            <NavLink to="/about" label="About" icon={<Info size={18} />} isActive={location.pathname === '/about'} />
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-1 px-4 py-2 rounded-full ${
                notificationsEnabled 
                  ? 'bg-secondary-100 text-secondary-700' 
                  : 'bg-primary-100 text-primary-700'
              }`}
              onClick={enableNotifications}
            >
              <Bell size={16} />
              <span>{notificationsEnabled ? 'Notifications On' : 'Enable Notifications'}</span>
            </motion.button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <div className="container mx-auto px-4 py-2 space-y-3">
              <MobileNavLink to="/" label="Map" icon={<Map size={18} />} onClick={closeMenu} />
              <MobileNavLink to="/about" label="About" icon={<Info size={18} />} onClick={closeMenu} />
              
              <button
                className={`w-full flex items-center space-x-2 p-3 rounded-lg ${
                  notificationsEnabled 
                    ? 'bg-secondary-50 text-secondary-600' 
                    : 'bg-gray-50 text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
                onClick={enableNotifications}
              >
                <Bell size={18} />
                <span>{notificationsEnabled ? 'Notifications Enabled' : 'Enable Notifications'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
  icon?: React.ReactNode;
  isActive: boolean;
}

const NavLink = ({ to, label, icon, isActive }: NavLinkProps) => (
  <div className="relative">
    <Link
      to={to}
      className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
        isActive 
          ? 'text-primary-600 font-medium' 
          : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>

    {isActive && (
      <motion.div
        layoutId="activeIndicator"
        className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500"
        initial={false}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    )}
  </div>
);



interface MobileNavLinkProps {
  to: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

const MobileNavLink = ({ to, label, icon, onClick }: MobileNavLinkProps) => (
  <Link
    to={to}
    className="flex items-center space-x-2 p-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600"
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export default Header;
