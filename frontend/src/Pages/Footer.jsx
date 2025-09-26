import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Footer = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const sections = [
    {
      title: "Features",
      items: ["AI Kolam Generator", "Mathematical Analysis", "Marketplace", "Artisan Community"],
    },
    {
      title: "Quick Links",
      items: ["Innovation", "Marketplace", "Community", "About"],
    },
    {
      title: "Contact",
      items: ["Email: info@kolamstudio.com", "Phone: +91 98765 43210", "Global Community"],
    },
  ];

  return (
    <footer className="bg-[#4C290C] text-[#F1E8E1] py-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 mb-8 px-4">
        <div>
          <h3 className="text-2xl font-bold mb-4">Kolam Studio</h3>
          <p>Reimagining tradition with AI, mathematics, and creativity.</p>
        </div>

        {sections.map((section, index) => (
          <div key={index}>
            <div
              className="flex justify-between items-center cursor-pointer md:cursor-auto"
              onClick={() => toggleSection(index)}
            >
              <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
              {/* Show arrow only on small screens */}
              <span className="md:hidden">
                {openSection === index ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>
            {/* Collapse on mobile, always open on md+ */}
            <ul
              className={`space-y-2 overflow-hidden transition-all duration-300 ${
                openSection === index ? "max-h-96" : "max-h-0 md:max-h-full"
              }`}
            >
              {section.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-center border-t border-white/10 pt-4">
        &copy; 2025 Kolam Studio. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
