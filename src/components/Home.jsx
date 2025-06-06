import { motion } from 'framer-motion';
import { FaRobot, FaCamera } from 'react-icons/fa';

const Home = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-20"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Empowering Your Skin Health with{' '}
          <span className="text-blue-600 relative">
            AI
            <motion.span
              className="absolute -bottom-2 left-0 w-full h-1 bg-blue-600"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
          Get quick, accurate, and personalized analysis of your skin condition through our advanced AI technology.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.a
            href="#check-your-skin"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-blue-600 text-white text-lg font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
          >
            Analyze My Skin
          </motion.a>
          <motion.a
            href="#about"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block text-blue-600 bg-transparent border-2 border-blue-600 text-lg font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition duration-300"
          >
            Learn More
          </motion.a>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <motion.div
          {...fadeIn}
          className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
            <FaRobot className="text-blue-600 text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">AI-Powered Analysis</h3>
          <p className="text-gray-600">
            Our advanced AI technology provides accurate and detailed analysis of your skin conditions.
          </p>
        </motion.div>

        <motion.div
          {...fadeIn}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
            <FaCamera className="text-green-600 text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Image Analysis</h3>
          <p className="text-gray-600">
            Upload photos of your skin condition for instant analysis and recommendations.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Home; 