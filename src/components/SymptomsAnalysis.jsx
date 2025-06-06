import { useState } from 'react';
import { analyzeSymptoms } from '../services/openaiService';
import ReactMarkdown from 'react-markdown';

const SymptomsAnalysis = () => {
  const [primarySymptom, setPrimarySymptom] = useState('');
  const [secondarySymptom, setSecondarySymptom] = useState('');
  const [duration, setDuration] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!primarySymptom.trim() && !secondarySymptom.trim() && !duration.trim() && !additionalNotes.trim()) {
      setError('Please enter some symptom information');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(''); // Clear previous analysis

    const symptomsData = {
      primary: primarySymptom.trim(),
      secondary: secondarySymptom.trim(),
      duration: duration.trim(),
      notes: additionalNotes.trim(),
    };

    try {
      const result = await analyzeSymptoms(symptomsData);
      setAnalysis(result);
    } catch (err) {
      setError(err.message || 'Error analyzing symptoms. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Describe Your Symptoms</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="symptom-primary" className="block text-sm font-medium text-gray-700 mb-1">Primary Symptom</label>
            <input
              type="text"
              id="symptom-primary"
              value={primarySymptom}
              onChange={(e) => setPrimarySymptom(e.target.value)}
              placeholder="E.G., Redness, Itching, Rash"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
            />
          </div>

          <div>
            <label htmlFor="symptom-secondary" className="block text-sm font-medium text-gray-700 mb-1">Secondary Symptom</label>
            <input
              type="text"
              id="symptom-secondary"
              value={secondarySymptom}
              onChange={(e) => setSecondarySymptom(e.target.value)}
              placeholder="E.G., Pain, Swelling, Dryness"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
            />
          </div>

          <div>
            <label htmlFor="symptom-duration" className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <input
              type="text"
              id="symptom-duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="E.G., 2 Weeks, 3 Days"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
            />
          </div>

          <div>
            <label htmlFor="symptom-notes" className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea
              id="symptom-notes"
              rows="4"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Any Other Relevant Information About Your Symptoms"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 resize-none"
            />
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || (!primarySymptom.trim() && !secondarySymptom.trim() && !duration.trim() && !additionalNotes.trim())}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white ${loading || (!primarySymptom.trim() && !secondarySymptom.trim() && !duration.trim() && !additionalNotes.trim()) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300`}
        >
          {loading ? 'Analyzing...' : 'Analyze Symptoms'}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {analysis && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg markdown-body">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Analysis Result:</h3>
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomsAnalysis; 