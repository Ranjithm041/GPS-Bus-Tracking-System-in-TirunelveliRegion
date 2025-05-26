import { useEffect } from 'react';
import { color, motion } from 'framer-motion';
import { Bus, MapPin, Cpu, Radio, BarChart4, Globe, Users } from 'lucide-react';

const AboutPage = () => {
  useEffect(() => {
    document.title = 'About - Tirunelveli Bus Tracker';
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-primary-500 text-white p-6">
            <h1 className="text-2xl font-bold mb-2">About This Project</h1>
            <p className="text-primary-100">
              GPS-based Bus Tracking System for Tirunelveli Region
            </p>
          </div>
          
          <div className="p-6">
            <div className="prose max-w-none">
              <p className="lead text-lg text-gray-700">
                This project is a final year academic initiative that combines hardware sensors, computer vision, 
                and web technologies to create a comprehensive bus tracking system for the Tirunelveli region.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">How It Works</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-primary-100 text-primary-600 rounded-full mr-3">
                      <Globe className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-gray-800">GPS Tracking</h3>
                  </div>
                  <p className="text-gray-700 text-sm">
                    GPS neo 6M modules installed on each bus collect real-time location data, 
                    sending coordinates, speed, and direction information to our servers.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-primary-100 text-primary-600 rounded-full mr-3">
                      <Cpu className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Computer Vision</h3>
                  </div>
                  <p className="text-gray-700 text-sm">
                    YOLOv5 object detection model processes USB camera feeds to count passengers
                    and detect available seats, enabling crowding analysis.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-primary-100 text-primary-600 rounded-full mr-3">
                      <Radio className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Data Transmission</h3>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Sensor data is transmitted via wireless communication to our backend systems,
                    where it's processed, analyzed, and stored in MongoDB.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-primary-100 text-primary-600 rounded-full mr-3">
                      <BarChart4 className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Data Processing</h3>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Our backend analyzes the data to calculate arrival times, optimize routes,
                    and identify potential service improvements.
                  </p>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">Key Features</h2>
              
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Real-time tracking of buses on interactive maps</span>
                </li>
                <li className="flex items-start">
                  <Bus className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Detailed bus information including route, speed, and next stops</span>
                </li>
                <li className="flex items-start">
                  <Users className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Seat availability and crowd level monitoring</span>
                </li>
                <li className="flex items-start">
                  <Radio className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Push notifications for bus arrivals at selected stops</span>
                </li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">Technologies Used</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded border border-gray-200 text-center">
                  <p className="font-medium text-gray-800">React</p>
                  <p className="text-xs text-gray-600">Frontend framework</p>
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-200 text-center">
                  <p className="font-medium text-gray-800">MongoDB</p>
                  <p className="text-xs text-gray-600">Database</p>
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-200 text-center">
                  <p className="font-medium text-gray-800">YOLOv5</p>
                  <p className="text-xs text-gray-600">Object detection</p>
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-200 text-center">
                  <p className="font-medium text-gray-800">GPS neo 6M</p>
                  <p className="text-xs text-gray-600">GPS module</p>
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-200 text-center">
                  <p className="font-medium text-gray-800">Leaflet</p>
                  <p className="text-xs text-gray-600">Mapping library</p>
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-200 text-center">
                  <p className="font-medium text-gray-800">Web Push</p>
                  <p className="text-xs text-gray-600">Notifications</p>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">Meet The Team</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                  <div className="w-30 h-30 bg-gray-200 rounded-full mx-auto mb-3">
                  <img
        src="https://ranjithm.netlify.app/assets/mypic-k9MameKu.jpg"
        alt="My Profile"
        className="w-30 h-30 rounded-full shadow-lg"
      />
                  </div>
                  <h3 className="font-semibold text-gray-800">Ranjith M</h3>
                  <p className="text-sm text-gray-600">Hardware Integration,Project Development</p>
                  <a 
  href="http://ranjithm.netlify.app/" 
  target="_blank" 
  rel="noopener noreferrer" 
  style={{
    color: 'blue',
    textDecoration: 'underline',
    fontSize: '0.8rem',          // smaller text
    fontFamily: '"Space Mono", monospace',  // unique monospaced font
    fontWeight: '500'            // slightly bold
  }}
>
  portfolio
</a>

                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3"></div>
                  <h3 className="font-semibold text-gray-800">Ezhilarasu </h3>
                  <p className="text-sm text-gray-600">Project Report writer</p>
                </div>
               
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;