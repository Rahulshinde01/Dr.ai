import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaListAlt } from 'react-icons/fa';
import ImageAnalysis from './ImageAnalysis';
import SymptomsAnalysis from './SymptomsAnalysis';

function CheckYourSkin() {
  const [activeTab, setActiveTab] = useState('image');

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="w-full">
      <motion.div
        {...fadeIn}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="flex border-b">
          <motion.button
            className={`flex-1 py-4 px-6 text-center font-semibold flex items-center justify-center space-x-2 ${
              activeTab === 'image'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('image')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaCamera className="text-xl" />
            <span>Image Analysis</span>
          </motion.button>
          <motion.button
            className={`flex-1 py-4 px-6 text-center font-semibold flex items-center justify-center space-x-2 ${
              activeTab === 'symptoms'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('symptoms')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaListAlt className="text-xl" />
            <span>Symptoms Analysis</span>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-8"
        >
          {activeTab === 'image' ? <ImageAnalysis /> : <SymptomsAnalysis />}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <div className="inline-block bg-gray-50 rounded-full px-6 py-3">
          <p className="text-gray-600 text-sm">
            Note: This is an AI-powered tool for preliminary analysis. Please consult a healthcare professional for accurate diagnosis and treatment.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default CheckYourSkin; 