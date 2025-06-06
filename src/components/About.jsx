import { motion } from 'framer-motion';
import { FaMicroscope, FaExclamationTriangle, FaClock, FaUserMd } from 'react-icons/fa';

const About = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Understanding Skin Diseases
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Empowering you with knowledge about skin conditions and their management through advanced AI technology.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Introduction Card */}
        <motion.div
          {...fadeIn}
          className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FaMicroscope className="text-blue-600 text-2xl" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Introduction to Skin Diseases</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Skin diseases are conditions that affect your skin, the body's largest organ. These conditions can vary widely in symptoms and severity, from minor rashes to serious infections. They often manifest as changes in skin appearance, such as:
          </p>
          <ul className="mt-4 space-y-2">
            {['Redness and inflammation', 'Itching and irritation', 'Dryness and flaking', 'Rashes and lesions'].map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center text-gray-600"
              >
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Common Causes Card */}
        <motion.div
          {...fadeIn}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex items-center mb-6">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <FaExclamationTriangle className="text-red-600 text-2xl" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Common Causes</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'Infections', desc: 'Bacterial, viral, fungal' },
              { title: 'Genetics', desc: 'Hereditary factors' },
              { title: 'Environment', desc: 'Sun, pollution' },
              { title: 'Lifestyle', desc: 'Diet, stress' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <h3 className="font-semibold text-gray-800">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Early Detection Card */}
        <motion.div
          {...fadeIn}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex items-center mb-6">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <FaClock className="text-green-600 text-2xl" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Importance of Early Detection</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-4">
            Early detection of skin conditions is crucial for effective treatment and better outcomes. Our AI-powered tool helps you:
          </p>
          <div className="space-y-3">
            {[
              'Identify potential skin conditions early',
              'Monitor changes in skin appearance',
              'Get preliminary analysis before professional consultation',
              'Track treatment progress'
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center text-gray-600"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skin Types Card */}
        <motion.div
          {...fadeIn}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex items-center mb-6">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <FaUserMd className="text-purple-600 text-2xl" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Skin Types and Conditions</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                type: 'Oily Skin',
                conditions: 'Acne, blackheads, enlarged pores',
                color: 'bg-yellow-100 text-yellow-800'
              },
              {
                type: 'Dry Skin',
                conditions: 'Eczema, flaking, itching',
                color: 'bg-blue-100 text-blue-800'
              },
              {
                type: 'Sensitive Skin',
                conditions: 'Rosacea, contact dermatitis',
                color: 'bg-red-100 text-red-800'
              },
              {
                type: 'Combination Skin',
                conditions: 'Mixed conditions, T-zone issues',
                color: 'bg-green-100 text-green-800'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border border-gray-200"
              >
                <h3 className="font-semibold text-gray-800">{item.type}</h3>
                <p className={`text-sm mt-1 ${item.color} px-2 py-1 rounded-full inline-block`}>
                  {item.conditions}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-12"
      >
        <p className="text-gray-600 italic">
          Remember: While our AI tool provides valuable insights, it's important to consult with healthcare professionals for proper diagnosis and treatment.
        </p>
      </motion.div>
    </div>
  );
};

export default About; 