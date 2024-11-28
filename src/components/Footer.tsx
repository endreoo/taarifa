import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Taariifa Suites</h3>
            <p className="text-gray-400 mb-4">
              Experience luxury living in the heart of Parklands, Nairobi. 
              Perfect for both short stays and extended residences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400"><Facebook /></a>
              <a href="#" className="hover:text-blue-400"><Instagram /></a>
              <a href="#" className="hover:text-blue-400"><Twitter /></a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>Parklands, Nairobi, Kenya</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                <a href="tel:+254700000000">+254 700 000 000</a>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                <a href="mailto:info@taariifasuites.com">info@taariifasuites.com</a>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/suites" className="hover:text-blue-400">Our Suites</a></li>
              <li><a href="/long-stay" className="hover:text-blue-400">Long Stay Packages</a></li>
              <li><a href="/amenities" className="hover:text-blue-400">Amenities</a></li>
              <li><a href="/contact" className="hover:text-blue-400">Contact Us</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} Taariifa Suites. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}