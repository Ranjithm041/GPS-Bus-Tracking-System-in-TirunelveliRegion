import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bus,
  MapPin,
  Cpu,
  Radio,
  BarChart4,
  Globe,
  Users
} from 'lucide-react';
import Ezhil from '../assets/Ezhil.jpeg';

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
                This project is a final-year academic initiative that combines hardware sensors, computer vision,
                and web technologies to create a comprehensive bus tracking system for the Tirunelveli region.
              </p>

              {/* How It Works Section */}
              <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">How It Works</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {[
                  {
                    Icon: Globe,
                    title: 'GPS Tracking',
                    desc: 'GPS neo 6M modules installed on each bus collect real-time location data, sending coordinates, speed, and direction information to our servers.'
                  },
                  {
                    Icon: Cpu,
                    title: 'Computer Vision',
                    desc: 'Google Open Source object detection model processes USB camera feeds to count passengers and detect available seats, enabling crowding analysis.'
                  },
                  {
                    Icon: Radio,
                    title: 'Data Transmission',
                    desc: 'Sensor data is transmitted via wireless communication to our backend systems, where it\'s processed, analyzed, and stored in Thingspeak Cloud.'
                  },
                  {
                    Icon: BarChart4,
                    title: 'Data Processing',
                    desc: 'Our backend analyzes the data to calculate arrival times, optimize routes, and identify potential service improvements.'
                  }
                ].map(({ Icon, title, desc }) => (
                  <div key={title} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-primary-100 text-primary-600 rounded-full mr-3">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-gray-800">{title}</h3>
                    </div>
                    <p className="text-gray-700 text-sm">{desc}</p>
                  </div>
                ))}
              </div>

              {/* Key Features */}
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

              {/* Technologies Used */}
              <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">Technologies Used</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {[
                  ['React', 'Frontend framework'],
                  ['Thingspeak', 'Cloud'],
                  ['Google Open Source', 'Object detection'],
                  ['GPS neo 6M', 'GPS module'],
                  ['Google Map', 'Mapping library'],
                  ['Web Push', 'Notifications']
                ].map(([tech, desc]) => (
                  <div key={tech} className="bg-gray-50 p-3 rounded border border-gray-200 text-center">
                    <p className="font-medium text-gray-800">{tech}</p>
                    <p className="text-xs text-gray-600">{desc}</p>
                  </div>
                ))}
              </div>

              {/* Meet The Team */}
              <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">Meet The Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Member 1 */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                  <div className="w-30 h-30 bg-gray-200 rounded-full mx-auto mb-3 ">
                    <img
                      src="https://ranjithm.netlify.app/assets/mypic-k9MameKu.jpg"
                      alt="Ranjith M"
                      className="w-30 h-30 rounded-full shadow-lg"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-800">Ranjith M</h3>
                  <p className="text-sm text-gray-600">Hardware Integration, Project Development</p>
                  <a
                    href="http://ranjithm.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm underline font-mono font-medium"
                  >
                    portfolio
                  </a>
                </div>

                {/* Member 2 */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                  <div className="w-30 h-30 bg-gray-200 rounded-full mx-auto mb-3">
                    <img
                      src={Ezhil}
                      alt="Ezhilarasu S"
                      className="w-30 h-30 rounded-full shadow-lg"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-800">Ezhilarasu S</h3>
                  <p className="text-sm text-gray-600">Project Report Writer</p>
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
