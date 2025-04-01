import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { Activity, Heart, Thermometer, Weight, Plus } from 'lucide-react';
import projectBackend from '../canister'; // Import the backend canister actor

export const Dashboard: React.FC = () => {
  const [healthData, setHealthData] = useState([]);
  const [userName, setUserName] = useState('User');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await projectBackend.getUserData('user123'); // Replace with dynamic user ID
        setUserName(userData.name);
        setHealthData(userData.healthMetrics); // Ensure the backend provides healthMetrics
      } catch (error) {
        console.error('Error fetching health data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-600 dark:text-gray-300">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {userName}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Here's your health overview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { icon: <Heart />, label: 'Heart Rate', value: `${healthData[0]?.heartRate || '--'} bpm`, color: 'text-red-500' },
          { icon: <Activity />, label: 'Blood Pressure', value: `${healthData[0]?.bloodPressure || '--'}`, color: 'text-blue-500' },
          { icon: <Weight />, label: 'Weight', value: `${healthData[0]?.weight || '--'} kg`, color: 'text-green-500' },
          { icon: <Thermometer />, label: 'Temperature', value: `${healthData[0]?.temperature || '--'}°C`, color: 'text-yellow-500' }
        ].map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className={`${metric.color} mb-4`}>{metric.icon}</div>
            <p className="text-gray-600 dark:text-gray-400">{metric.label}</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {metric.value}
            </h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Heart Rate Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="heartRate" 
                  stroke="#ef4444" 
                  fill="#fee2e2" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Blood Pressure History
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="bloodPressure" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
};