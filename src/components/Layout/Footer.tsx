import { Bus, Github, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Bus className="h-6 w-6 text-primary-500 mr-2" />
            <p className="text-gray-700">
              Tirunelveli Bus Tracker &copy; {new Date().getFullYear()}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:space-x-8">
            <p className="text-sm text-gray-600 mb-2 md:mb-0">
              Final Year Project - GPS Based Bus Tracking System
            </p>
            
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-500 hover:text-primary-500 transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-primary-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;