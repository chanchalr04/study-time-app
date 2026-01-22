// components/Footer.js
import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              © {currentYear} StudyTime. All rights reserved by CR
            </p>
          </div>
          <div className="flex space-x-6">
            <a
              href="/privacy"
              className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="https://www.linkedin.com/in/chanchal-raikwar-cr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
