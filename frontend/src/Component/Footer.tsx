import {  Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 lg:grid-cols-4 md:grid-cols-2">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-emerald-400">LiveMad</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Your trusted online marketplace for electronics, fashion, home essentials,
              and wellness products. Shop with confidence and enjoy fast delivery across India.
            </p>
 
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors">FAQs</a></li>
              <li><a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors">Returns</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors">Electronics</a></li>
              <li><a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors">Fashion</a></li>
              <li><a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors">Home & Kitchen</a></li>
              <li><a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors">Wellness</a></li>
              <li><a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors">Sports</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-emerald-400 flex-shrink-0" />
                <span className="text-slate-300">123 Commerce Street, Mumbai, India</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-emerald-400 flex-shrink-0" />
                <span className="text-slate-300">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-emerald-400 flex-shrink-0" />
                <span className="text-slate-300">support@livemad.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-slate-400 text-sm">
              © 2024 LiveMad. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Terms of Service</a>
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;