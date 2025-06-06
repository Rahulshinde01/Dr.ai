import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import CheckYourSkin from './components/CheckYourSkin';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <section id="home" className="py-16 bg-gray-100">
          <Home />
        </section>
        <section id="about" className="py-16">
          <About />
        </section>
        <section id="check-your-skin" className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
              Check Your Skin
            </h1>
            <CheckYourSkin />
          </div>
        </section>
        <section id="contact-us" className="py-16">
          <ContactUs />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
