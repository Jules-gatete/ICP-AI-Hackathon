import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { MedicalRecord } from '../types';
import projectBackend from '../canister';

export const MedicalHistory: React.FC = () => {
  const { user } = useAuth(); // Get the authenticated user
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<MedicalRecord>>({
    date: new Date().toISOString().split('T')[0],
    symptoms: [],
    medications: [],
  });
  const [loading, setLoading] = useState(false);

  const userId = user?.id || ''; // Use the authenticated user's ID

  // Fetch medical history from the backend
  useEffect(() => {
    if (!userId) return;

    const fetchMedicalHistory = async () => {
      setLoading(true);
      try {
        const userDataResponse = await projectBackend.getUserData(userId);
        if ('ok' in userDataResponse) {
          const userData = userDataResponse.ok;
          setRecords(
            (userData.medicalHistory || []).map((history: string, index: number) => ({
              id: index.toString(),
              date: new Date().toISOString().split('T')[0], // Replace with actual date if available
              condition: history,
              symptoms: userData.symptoms || [],
              medications: [], // Add if backend supports medications
              notes: '',
            }))
          );
        } else {
          console.error('Error fetching user data:', userDataResponse.err);
        }
      } catch (error) {
        console.error('Error fetching medical history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalHistory();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !newRecord.condition || !newRecord.date) return;

    try {
      // Add the new medical history record to the backend
      const response = await projectBackend.addMedicalHistory(userId, newRecord.condition);
      if (response === 'Medical history updated!') {
        setRecords((prev) => [
          ...prev,
          {
            ...newRecord,
            id: Date.now().toString(),
            symptoms: newRecord.symptoms || [],
            medications: newRecord.medications || [],
          } as MedicalRecord,
        ]);
        // Add symptoms if provided
        if (newRecord.symptoms && newRecord.symptoms.length > 0) {
          await projectBackend.addSymptoms(userId, newRecord.symptoms);
        }
        setShowForm(false);
        setNewRecord({
          date: new Date().toISOString().split('T')[0],
          symptoms: [],
          medications: [],
        });
      } else {
        console.error('Failed to update medical history:', response);
      }
    } catch (error) {
      console.error('Error adding medical history:', error);
    }
  };

  // Rest of the component remains the same...
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Medical History
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Record
        </motion.button>
      </div>

      {loading && (
        <div className="text-center text-gray-600 dark:text-gray-300">
          Loading medical history...
        </div>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8"
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={newRecord.date}
                  onChange={(e) => setNewRecord((prev) => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Condition
                </label>
                <input
                  type="text"
                  value={newRecord.condition || ''}
                  onChange={(e) => setNewRecord((prev) => ({ ...prev, condition: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Symptoms (comma-separated)
                </label>
                <input
                  type="text"
                  value={newRecord.symptoms?.join(', ') || ''}
                  onChange={(e) =>
                    setNewRecord((prev) => ({
                      ...prev,
                      symptoms: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Medications (comma-separated)
                </label>
                <input
                  type="text"
                  value={newRecord.medications?.join(', ') || ''}
                  onChange={(e) =>
                    setNewRecord((prev) => ({
                      ...prev,
                      medications: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={newRecord.notes || ''}
                  onChange={(e) => setNewRecord((prev) => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  rows={4}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Save Record
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {records.map((record) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FileText className="w-6 h-6 text-blue-500 dark:text-blue-300" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {record.condition}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(record.date).toLocaleDateString()}
                  </span>
                </div>
                {record.symptoms.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Symptoms
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {record.symptoms.map((symptom, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full text-sm"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {record.medications.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Medications
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {record.medications.map((medication, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full text-sm"
                        >
                          {medication}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {record.notes && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notes
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {record.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};