import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import config from '../config';

function Footer() {
  // Log the entire config to debug
  console.log('Full Config:', config);

  // Default values if config is undefined
  const cfg = config || {};
  const brand = cfg.brand || { themeColor: '#FBBF24', accentColor: '#FF6B00', name: 'Coco Bubble Tea' };
  const navigation = cfg.navigation || [];
  const social = cfg.social || {};
  const contact = cfg.contact || { address: { email: 'info@coco.com', phone: '123-456-7890', line1: '', city: '', postcode: '' } };
  const footer = cfg.footer || { sections: [], copyright: { text: '© {year} {brand.name}. All rights reserved.', year: new Date().getFullYear() } };

  // Log specific values to ensure they're accessible
  console.log('Contact Values:', { email: contact.address?.email, phone: contact.address?.phone });

  // Map social media icons
  const socialIcons = {
    facebook: FaFacebook,
    instagram: FaInstagram,
    twitter: FaTwitter
  };

  return (
    <footer
      className={`bg-gradient-to-r from-[${brand.themeColor}] to-[${brand.accentColor}] py-8 text-white`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {footer.sections.map((section, index) => (
            <div key={index}>
              <h3
                className={`text-lg font-semibold mb-4`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {section.title}
              </h3>

              {section.type === 'navigation' && (
                <ul className="space-y-2">
                  {navigation.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`hover:text-[${brand.accentColor}] transition-colors`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {section.type === 'contact' && (
                <p
                  className=""
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {section.display.map((item, idx) => {
                    const fieldValues = {
                      'brand.name': brand.name,
                      'contact.address.line1': contact.address?.line1,
                      'contact.address.city': contact.address?.city,
                      'contact.address.postcode': contact.address?.postcode,
                      'contact.address.email': contact.address?.email,
                      'contact.address.phone': contact.address?.phone
                    };
                    const value = fieldValues[item.field] || '';
                    console.log(`Rendering Field ${item.field}:`, value);
                    return (
                      <React.Fragment key={idx}>
                        {item.prefix || ''}{value}
                        <br />
                      </React.Fragment>
                    );
                  })}
                </p>
              )}

              {section.type === 'social' && (
                <div className="flex justify-center md:justify-start space-x-4">
                  {section.platforms.map((platform) => {
                    const Icon = socialIcons[platform];
                    return social[platform] ? (
                      <a
                        key={platform}
                        href={social[platform]}
                        className={`hover:text-[${brand.accentColor}] transition-colors`}
                      >
                        <Icon className="h-6 w-6" />
                      </a>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={`mt-8 text-center`}>
          <p style={{ fontFamily: 'Poppins, sans-serif' }}>
            {footer.copyright.text
              .replace('{year}', footer.copyright.year)
              .replace('{brand.name}', brand.name)}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;