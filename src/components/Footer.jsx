import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import config from '../config';

function Footer() {
  const { contact, social, brand, navigation } = config;

  return (
    <footer
      className={`bg-gradient-to-r from-[${brand.themeColor}] to-[${brand.accentColor}] py-8`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Navigation Links */}
          <div>
            <h3
              className={`text-lg font-semibold text-[${brand.textColor}] mb-4`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Quick Links
            </h3>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`text-[${brand.textColor}] hover:text-[${brand.accentColor}] transition-colors`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3
              className={`text-lg font-semibold text-[${brand.textColor}] mb-4`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Contact Us
            </h3>
            <p
              className={`text-[${brand.textColor}]`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {brand.name}
              <br />
              {contact.addressLine1}
              <br />
              {contact.city}
              <br />
              {contact.postcode}
              <br />
              Email: {contact.email}
              <br />
              Phone: {contact.phone}
            </p>
          </div>

          {/* Social Media */}
          <div>
            <h3
              className={`text-lg font-semibold text-[${brand.textColor}] mb-4`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Follow Us
            </h3>
            <div className="flex justify-center md:justify-start space-x-4">
              {social.facebook && (
                <a
                  href={social.facebook}
                  className={`text-[${brand.textColor}] hover:text-[${brand.accentColor}] transition-colors`}
                >
                  <FaFacebook className="h-6 w-6" />
                </a>
              )}
              {social.instagram && (
                <a
                  href={social.instagram}
                  className={`text-[${brand.textColor}] hover:text-[${brand.accentColor}] transition-colors`}
                >
                  <FaInstagram className="h-6 w-6" />
                </a>
              )}
              {social.twitter && (
                <a
                  href={social.twitter}
                  className={`text-[${brand.textColor}] hover:text-[${brand.accentColor}] transition-colors`}
                >
                  <FaTwitter className="h-6 w-6" />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className={`mt-8 text-center text-[${brand.textColor}]`}>
          <p style={{ fontFamily: 'Poppins, sans-serif' }}>
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;