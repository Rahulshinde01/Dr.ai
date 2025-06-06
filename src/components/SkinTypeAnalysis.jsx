import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSpinner, FaInfoCircle } from 'react-icons/fa';

const SkinTypeAnalysis = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    oiliness: '',
    dryness: '',
    sensitivity: '',
    pores: '',
    texture: '',
    concerns: '',
    age: '',
    climate: '',
    lifestyle: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const prompt = `Based on the following skin characteristics, determine the skin type and provide personalized recommendations:
        - Oiliness level: ${formData.oiliness}
        - Dryness level: ${formData.dryness}
        - Sensitivity: ${formData.sensitivity}
        - Pore size: ${formData.pores}
        - Skin texture: ${formData.texture}
        - Main concerns: ${formData.concerns}
        - Age: ${formData.age}
        - Climate: ${formData.climate}
        - Lifestyle factors: ${formData.lifestyle}

        Please provide:
        1. Primary skin type
        2. Secondary characteristics
        3. Specific concerns
        4. Recommended skincare routine
        5. Products to avoid`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7
        })
      });

      const data = await response.json();
      setResult(data.choices[0].message.content);
    } catch (error) {
      console.error('Error:', error);
      setResult('Sorry, there was an error analyzing your skin type. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-300 flex items-center space-x-2"
        >
          <FaInfoCircle />
          <span>Know Your Skin Type</span>
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-xl p-6 w-[400px] max-h-[80vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Skin Type Analysis</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  How oily is your skin?
                </label>
                <select
                  name="oiliness"
                  value={formData.oiliness}
                  onChange={handleChange}
                  required
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select...</option>
                  <option value="Very oily">Very oily</option>
                  <option value="Moderately oily">Moderately oily</option>
                  <option value="Slightly oily">Slightly oily</option>
                  <option value="Not oily">Not oily</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  How dry is your skin?
                </label>
                <select
                  name="dryness"
                  value={formData.dryness}
                  onChange={handleChange}
                  required
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select...</option>
                  <option value="Very dry">Very dry</option>
                  <option value="Moderately dry">Moderately dry</option>
                  <option value="Slightly dry">Slightly dry</option>
                  <option value="Not dry">Not dry</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  How sensitive is your skin?
                </label>
                <select
                  name="sensitivity"
                  value={formData.sensitivity}
                  onChange={handleChange}
                  required
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select...</option>
                  <option value="Very sensitive">Very sensitive</option>
                  <option value="Moderately sensitive">Moderately sensitive</option>
                  <option value="Slightly sensitive">Slightly sensitive</option>
                  <option value="Not sensitive">Not sensitive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pore size
                </label>
                <select
                  name="pores"
                  value={formData.pores}
                  onChange={handleChange}
                  required
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select...</option>
                  <option value="Large">Large</option>
                  <option value="Medium">Medium</option>
                  <option value="Small">Small</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skin texture
                </label>
                <select
                  name="texture"
                  value={formData.texture}
                  onChange={handleChange}
                  required
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select...</option>
                  <option value="Smooth">Smooth</option>
                  <option value="Rough">Rough</option>
                  <option value="Uneven">Uneven</option>
                  <option value="Combination">Combination</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main skin concerns
                </label>
                <textarea
                  name="concerns"
                  value={formData.concerns}
                  onChange={handleChange}
                  required
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 pl-1.5"
                  placeholder="e.g., acne, wrinkles, dark spots..."
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age range
                </label>
                <select
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select...</option>
                  <option value="Under 20">Under 20</option>
                  <option value="20-30">20-30</option>
                  <option value="31-40">31-40</option>
                  <option value="41-50">41-50</option>
                  <option value="Over 50">Over 50</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Climate
                </label>
                <select
                  name="climate"
                  value={formData.climate}
                  onChange={handleChange}
                  required
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select...</option>
                  <option value="Hot and humid">Hot and humid</option>
                  <option value="Hot and dry">Hot and dry</option>
                  <option value="Cold and dry">Cold and dry</option>
                  <option value="Moderate">Moderate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lifestyle factors
                </label>
                <textarea
                  name="lifestyle"
                  value={formData.lifestyle}
                  onChange={handleChange}
                  required
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 pl-1.5"
                  placeholder="e.g., stress levels, sleep patterns, diet..."
                  rows="2"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Analyzing...
                  </span>
                ) : (
                  'Analyze My Skin Type'
                )}
              </motion.button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="prose prose-sm max-w-none">
                {result.split('\n').map((line, index) => (
                  <p key={index} className="text-gray-700 mb-2">
                    {line}
                  </p>
                ))}
              </div>
              <button
                onClick={() => {
                  setResult(null);
                  setFormData({
                    oiliness: '',
                    dryness: '',
                    sensitivity: '',
                    pores: '',
                    texture: '',
                    concerns: '',
                    age: '',
                    climate: '',
                    lifestyle: ''
                  });
                }}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-300"
              >
                Start New Analysis
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SkinTypeAnalysis; 