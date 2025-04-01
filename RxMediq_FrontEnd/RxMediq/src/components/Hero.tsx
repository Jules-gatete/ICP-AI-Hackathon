import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Shield, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
}

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    console.log('Hero: Fetching features...');
    const fetchFeatures = async () => {
      const fetchedFeatures = [
        {
          icon: <Brain className="w-8 h-8" />,
          title: "AI Analysis",
          description: "Get personalized health insights and recommendations",
        },
        {
          icon: <Shield className="w-8 h-8" />,
          title: "Secure Data",
          description: "Your health data is encrypted and protected",
        },
        {
          icon: <Activity className="w-8 h-8" />,
          title: "Health Tracking",
          description: "Monitor your health metrics in real-time",
        },
      ];
      setFeatures(fetchedFeatures);
    };

    fetchFeatures();
  }, []);

  console.log('Hero: Rendering with features:', features);
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
            AI-Powered Healthcare Platform
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Secure, personalized healthcare insights powered by artificial intelligence
            and blockchain technology.
          </p>
          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
              aria-label="Login"
            >
              Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="px-6 py-3 bg-teal-500 text-white rounded-lg shadow-lg hover:bg-teal-600 transition-colors"
              aria-label="Register"
            >
              Register
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <div className="text-blue-500 mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center text-gray-500 mt-4">
          Debug: Hero is rendering
        </div>
      </div>
    </section>
  );
};

// Add default export for React.lazy
export default Hero;