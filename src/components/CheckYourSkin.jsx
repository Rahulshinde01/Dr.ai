import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaSpinner, FaUpload, FaExclamationTriangle, FaVideo, FaLaptop, FaDesktop } from 'react-icons/fa';

const CheckYourSkin = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [formData, setFormData] = useState({
    symptoms: '',
    duration: '',
    location: '',
    painLevel: '',
    previousHistory: '',
    medications: '',
    allergies: '',
    lifestyle: ''
  });

  // Debug: Check if mediaDevices is available
  useEffect(() => {
    console.log('Checking mediaDevices availability...');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log('mediaDevices API is available');
    } else {
      console.error('mediaDevices API is not available');
      setCameraError('Camera API is not supported in your browser');
    }
  }, []);

  // Cleanup camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        console.log('Cleaning up camera stream...');
        stream.getTracks().forEach(track => {
          console.log('Stopping track:', track.label);
          track.stop();
        });
      }
    };
  }, [stream]);

  // Get available cameras
  const getAvailableCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log('Available cameras:', videoDevices);
      setAvailableCameras(videoDevices);
      
      // If there's only one camera, select it automatically
      if (videoDevices.length === 1) {
        setSelectedCamera(videoDevices[0].deviceId);
      }
    } catch (error) {
      console.error('Error getting cameras:', error);
      setCameraError('Unable to access camera devices');
    }
  };

  // Get cameras when component mounts
  useEffect(() => {
    getAvailableCameras();
  }, []);

  // Handle video element mounting
  useEffect(() => {
    if (showCamera && videoRef.current && stream) {
      console.log('Setting up video element...');
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        console.log('Video metadata loaded');
        videoRef.current.play()
          .then(() => console.log('Video playback started'))
          .catch(err => console.error('Error playing video:', err));
      };
    }
  }, [showCamera, stream]);

  const startCamera = async () => {
    console.log('Starting camera...');
    try {
      setCameraError(null);
      
      if (!selectedCamera) {
        setCameraError('Please select a camera first');
        return;
      }

      const constraints = {
        video: {
          deviceId: selectedCamera,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      console.log('Attempting to access camera with constraints:', constraints);

      try {
        console.log('Trying to access selected camera...');
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('Successfully got media stream:', mediaStream);
        setStream(mediaStream);
        setShowCamera(true);
      } catch (error) {
        console.error('Camera access error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Camera error:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      
      let errorMessage = 'Unable to access camera. ';
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please make sure you have granted camera permissions.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found on your device.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Camera is already in use by another application.';
      } else {
        errorMessage += 'Please try again.';
      }
      
      setCameraError(errorMessage);
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    if (stream) {
      stream.getTracks().forEach(track => {
        console.log('Stopping track:', track.label);
        track.stop();
      });
      setStream(null);
    }
    setShowCamera(false);
    setCameraError(null);
  };

  const captureImage = () => {
    console.log('Capturing image...');
    if (videoRef.current && videoRef.current.srcObject) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        console.log('Image captured successfully');
        
        setSelectedImage(imageData);
        stopCamera();
      } catch (error) {
        console.error('Error capturing image:', error);
        setCameraError('Error capturing image. Please try again.');
      }
    } else {
      console.error('Video ref is not available for capture');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
      const prompt = `Based on the following information, analyze the potential skin condition and provide recommendations:
        - Symptoms: ${formData.symptoms}
        - Duration: ${formData.duration}
        - Location: ${formData.location}
        - Pain Level: ${formData.painLevel}
        - Previous History: ${formData.previousHistory}
        - Current Medications: ${formData.medications}
        - Allergies: ${formData.allergies}
        - Lifestyle Factors: ${formData.lifestyle}

        Please provide:
        1. Potential skin condition(s)
        2. Severity assessment
        3. Recommended next steps
        4. When to seek immediate medical attention
        5. General care recommendations`;

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
      setResult('Sorry, there was an error analyzing your skin condition. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upload Skin Image</h2>
          <div className="space-y-4">
            {showCamera ? (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-lg"
                  style={{ transform: 'scaleX(-1)' }}
                />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
          <button
                    onClick={captureImage}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Capture
          </button>
          <button
                    onClick={stopCamera}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {selectedImage ? (
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Selected skin condition"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      ×
          </button>
        </div>
                ) : (
                  <div className="space-y-4">
                    <FaCamera className="mx-auto text-4xl text-gray-400" />
                    <p className="text-gray-600">Choose how you want to capture the image</p>
                    {cameraError && (
                      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                        <div className="flex">
                          <FaExclamationTriangle className="text-red-400 mr-2" />
                          <p className="text-sm text-red-700">{cameraError}</p>
                        </div>
                      </div>
                    )}
                    <div className="space-y-4">
                      {availableCameras.length > 0 && (
                        <div className="flex flex-col space-y-2">
                          <label className="text-sm font-medium text-gray-700">Select Camera:</label>
                          <select
                            value={selectedCamera || ''}
                            onChange={(e) => setSelectedCamera(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Choose a camera...</option>
                            {availableCameras.map((camera) => (
                              <option key={camera.deviceId} value={camera.deviceId}>
                                {camera.label || `Camera ${camera.deviceId.slice(0, 5)}...`}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                        <button
                          onClick={startCamera}
                          disabled={!selectedCamera}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaVideo />
                          <span>Use Camera</span>
                        </button>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                          >
                            <FaUpload />
                            <span>Select File</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <FaExclamationTriangle className="text-yellow-400 mr-2" />
                <p className="text-sm text-yellow-700">
                  For best results, ensure the image is well-lit and clearly shows the affected area.
                </p>
              </div>
        </div>
          </div>
        </motion.div>

        {/* Analysis Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Skin Condition Details</h2>
          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your symptoms
                </label>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-900"
                  placeholder="e.g., red, itchy rash with small bumps..."
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How long have you had these symptoms?
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  <option value="" className="text-gray-400">Select duration...</option>
                  <option value="Less than 24 hours">Less than 24 hours</option>
                  <option value="1-3 days">1-3 days</option>
                  <option value="4-7 days">4-7 days</option>
                  <option value="1-2 weeks">1-2 weeks</option>
                  <option value="More than 2 weeks">More than 2 weeks</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location on body
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-900"
                  placeholder="e.g., face, arms, legs..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pain or discomfort level
                </label>
                <select
                  name="painLevel"
                  value={formData.painLevel}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  <option value="" className="text-gray-400">Select pain level...</option>
                  <option value="No pain">No pain</option>
                  <option value="Mild discomfort">Mild discomfort</option>
                  <option value="Moderate pain">Moderate pain</option>
                  <option value="Severe pain">Severe pain</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Previous skin conditions
                </label>
                <textarea
                  name="previousHistory"
                  value={formData.previousHistory}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-900"
                  placeholder="Any previous skin conditions or similar issues..."
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current medications
                </label>
                <textarea
                  name="medications"
                  value={formData.medications}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-900"
                  placeholder="List any medications you're currently taking..."
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Known allergies
                </label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-900"
                  placeholder="List any allergies you have..."
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lifestyle factors
                </label>
                <textarea
                  name="lifestyle"
                  value={formData.lifestyle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-900"
                  placeholder="Recent changes in diet, stress levels, exposure to new products..."
                  rows="2"
                />
      </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Analyzing...
                  </span>
                ) : (
                  'Analyze Skin Condition'
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
                  setSelectedImage(null);
                  setFormData({
                    symptoms: '',
                    duration: '',
                    location: '',
                    painLevel: '',
                    previousHistory: '',
                    medications: '',
                    allergies: '',
                    lifestyle: ''
                  });
                }}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
              >
                Start New Analysis
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CheckYourSkin; 