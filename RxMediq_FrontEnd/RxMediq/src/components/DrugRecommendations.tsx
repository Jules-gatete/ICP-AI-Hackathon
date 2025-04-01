import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pill, AlertCircle, ThumbsUp, ChevronDown, ChevronUp } from 'lucide-react';
import type { DrugRecommendation } from '../types';
import projectBackend from '../canister'; // Import the backend canister actor

export const DrugRecommendations: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<DrugRecommendation[]>([]);
  const [expandedDrug, setExpandedDrug] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call the backend's `getDrugRecommendation` method
      const response = await projectBackend.getDrugRecommendation('user123'); // Replace 'user123' with the actual user ID
      if (response) {
        const formattedRecommendations = [
          {
            name: response.medicineName,
            effectivenessScore: response.effectiveness,
            description: `This is a recommended drug based on your symptoms and medical history.`,
            sideEffects: ['Side effect 1', 'Side effect 2'], // Replace with actual side effects if available
            alternatives: response.alternativeOptions
          }
        ];
        setRecommendations(formattedRecommendations);
      } else {
        setRecommendations([]);
      }
    } catch (error) {
      console.error('Error fetching drug recommendations:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Drug Recommendations
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Describe your symptoms
            </label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              rows={4}
              placeholder="Enter your symptoms in detail..."
              required
            />
          </div>
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              <Pill className="w-5 h-5" />
              {loading ? 'Analyzing...' : 'Get Recommendations'}
            </motion.button>
          </div>
        </form>
      </div>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center py-12"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </motion.div>
      )}

      {recommendations.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          {recommendations.map((drug) => (
            <motion.div
              key={drug.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div
                className="p-6 cursor-pointer"
                onClick={() => setExpandedDrug(expandedDrug === drug.name ? null : drug.name)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Pill className="w-6 h-6 text-blue-500 dark:text-blue-300" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {drug.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <ThumbsUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {drug.effectivenessScore}% Effectiveness Score
                        </span>
                      </div>
                    </div>
                  </div>
                  {expandedDrug === drug.name ? (
                    <ChevronUp className="w-6 h-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </div>

              {expandedDrug === drug.name && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 pb-6"
                >
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Description
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {drug.description}
                    </p>

                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Side Effects
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {drug.sideEffects.map((effect, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full text-sm"
                        >
                          {effect}
                        </span>
                      ))}
                    </div>

                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Alternatives
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {drug.alternatives.map((alt, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm"
                        >
                          {alt}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            These recommendations are generated by AI and should not replace professional medical advice. 
            Always consult with a healthcare provider before starting or changing any medication.
          </p>
        </div>
      )}
    </div>
  );
};