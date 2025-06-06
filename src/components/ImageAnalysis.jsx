import { useState } from 'react';
import { analyzeSkinImage } from '../services/openaiService';
import ReactMarkdown from 'react-markdown';

const ImageAnalysis = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [primarySymptom, setPrimarySymptom] = useState('');
  const [secondarySymptom, setSecondarySymptom] = useState('');
  const [duration, setDuration] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 20MB)
      if (file.size > 20 * 1024 * 1024) {
        setError('Image size should be less than 20MB');
        setSelectedImage(null); // Clear selected image if too large
        setPreview(null);
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        setSelectedImage(null); // Clear selected image if wrong type
        setPreview(null);
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError(''); // Clear previous errors on new file select
      setAnalysis(''); // Clear previous analysis
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
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
      const base64 = preview.split(',')[1];
      const result = await analyzeSkinImage(base64, symptomsData);
      setAnalysis(result);
    } catch (err) {
      setError(err.message || 'Error analyzing image. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-6">
        <div>
          <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">
            Upload Skin Image
          </label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="mt-2 text-sm text-gray-500">
            Supported formats: JPG, PNG, GIF. Max size: 20MB
          </p>
        </div>

        {preview && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Image Preview:</h3>
            <img
              src={preview}
              alt="Preview"
              className="max-w-full h-auto rounded-md shadow-md"
            />
          </div>
        )}

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Describe Your Symptoms (Optional)</h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="primary-symptom" className="block text-sm font-medium text-gray-700 mb-1">Primary Symptom</label>
              <input
                type="text"
                id="primary-symptom"
                value={primarySymptom}
                onChange={(e) => setPrimarySymptom(e.target.value)}
                placeholder="E.G., Redness, Itching, Rash"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              />
            </div>

            <div>
              <label htmlFor="secondary-symptom" className="block text-sm font-medium text-gray-700 mb-1">Secondary Symptom</label>
              <input
                type="text"
                id="secondary-symptom"
                value={secondarySymptom}
                onChange={(e) => setSecondarySymptom(e.target.value)}
                placeholder="E.G., Pain, Swelling, Dryness"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="E.G., 2 Weeks, 3 Days"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              />
            </div>

            <div>
              <label htmlFor="additional-notes" className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
              <textarea
                id="additional-notes"
                rows="3"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Any Other Relevant Information About Your Symptoms"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 resize-none"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || !selectedImage}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white ${loading || !selectedImage ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300`}
        >
          {loading ? 'Analyzing...' : 'Analyze Image & Symptoms'}
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

export default ImageAnalysis; 