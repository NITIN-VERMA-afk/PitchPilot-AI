import React from "react";

const Footer: React.FC = () => {
  return (
    <footer
      role="contentinfo"
      className="bg-gradient-to-r from-indigo-600 to-purple-700 dark:from-gray-900 dark:to-gray-800 text-white py-10 px-4 text-center shadow-inner mt-12 font-inter"
    >
      <div className="container mx-auto">
        <p className="text-lg font-medium">
          &copy; {new Date().getFullYear()} AI Pitch Analyzer. All rights reserved.
        </p>

        <p className="text-sm mt-2 text-indigo-200 dark:text-gray-400">
          Built with passion and AI.
        </p>

        <div className="mt-4 flex justify-center gap-4 text-sm text-indigo-200 dark:text-gray-400">
          <a href="/about" className="hover:underline">
            About
          </a>
          <a href="/privacy" className="hover:underline">
            Privacy
          </a>
          <a
            href="https://github.com/your-repo"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

