import React from 'react';
import { useNavigate } from 'react-router-dom';

function ContactSection() {
  const navigate = useNavigate();

  return (
    <section className="pt-20 py-16 bg-white relative min-h-screen flex flex-col items-center">
      <div className="container mx-auto px-4 text-center">
        {/* Header */}
        <div className="relative inline-block mb-4">
          <h2 className="text-5xl font-bold text-black uppercase">
            Contact Us
          </h2>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 border-t-2 border-coco-orange w-1/2"></div>
        </div>

        {/* Contact Details */}
        <div className="mb-12">
          <p className="text-lg text-coco-gray mb-4">
            10 Meadow Row, Buckingham, MK18 1PU
          </p>
          <p className="text-lg text-coco-gray mb-4">
            Phone: +44 123 456 7890
          </p>
          <p className="text-lg text-coco-gray">
            Email: info@cocobubbletea.com
          </p>
        </div>

        {/* Map Embed */}
        <div className="flex justify-center mb-12">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2456.3378296397827!2d-0.988372823652156!3d52.00072172454574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876e2be6321308b%3A0x74fd2a9afbc5bc80!2sMeadow%20Row%2C%20Buckingham%20MK18%201PU!5e0!3m2!1sen!2suk!4v1745696926032!5m2!1sen!2suk"
            width="100%"
            height="450"
            style={{ border: 0, maxWidth: '800px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg shadow-lg w-full"
          ></iframe>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold text-black uppercase mb-4">
            Send Us a Message
          </h3>
          <div className="flex justify-center mb-8">
            <div className="border-t-2 border-coco-orange w-24"></div>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:border-coco-orange"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:border-coco-orange"
            />
            <textarea
              placeholder="Your Message"
              rows="5"
              className="w-full p-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:border-coco-orange"
            ></textarea>
            <button
              onClick={() => alert('Message sent! (This is a placeholder action)')}
              className="bg-coco-yellow hover:bg-coco-orange text-black font-bold py-2 px-6 rounded-full transition-colors"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>

      {/* Floating Order Now Button */}
      <button
        onClick={() => navigate('/order-online')}
        className="fixed bottom-4 right-4 bg-coco-yellow hover:bg-coco-orange text-black font-bold py-2 px-6 rounded-full shadow-lg transition-colors flex items-center gap-2"
      >
        Order Now
      </button>
    </section>
  );
}

export default ContactSection;