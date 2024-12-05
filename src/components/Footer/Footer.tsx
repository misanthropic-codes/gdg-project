'use client';

import { Facebook, Linkedin, Instagram } from 'lucide-react';
import { SocialIcon } from './SocialIcon';
import { NavLink } from './NavLink';
import Link from 'next/link';

const Footer = () => {
  const socialLinks = [
    { icon: <Facebook size={20} />, href: "https://www.facebook.com/people/GDSC-HIT/61551446811901/", label: "Facebook" },
    { icon: <Linkedin size={20} />, href: "https://www.linkedin.com/company/gdgoncampushit/", label: "LinkedIn" },
    { icon: <Instagram size={20} />, href: "https://www.instagram.com/gdg_hit/", label: "Instagram" },
  ];

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/members", label: "Members" },
    { href: "/events", label: "Events" },
    { href: "/gallery", label: "Gallery" },
    { href: "/testimonials", label: "Testimonials" },
  ];

  return (
    <footer className="w-full py-8 transition-colors duration-300 bg-blue-500 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        {/* Social Icons */}
        <div className="flex justify-center space-x-6 mb-8">
          {socialLinks.map((link) => (
            <SocialIcon
              key={link.label}
              icon={link.icon}
              href={link.href}
              label={link.label}
            />
          ))}
        </div>

        {/* Container for Nav Links and Contact Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-center md:gap-6 mb-8">
          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center md:flex-nowrap gap-4 md:gap-8 text-sm md:text-base">
            {navLinks.map((link) => (
              <NavLink key={link.label} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Contact Button */}
          <Link 
            href="/contact"
            className="relative px-6 py-2 overflow-hidden rounded-full bg-transparent group mt-8 md:mt-0 md:ml-8 inline-block text-center"
          >
            <span className="absolute inset-0 w-full h-full bg-white opacity-20 group-hover:scale-x-110 transition-transform duration-500 rounded-full"></span>
            <span className="relative z-10 text-white transition-colors duration-300">
              Contact Us
            </span>
            <span className="absolute inset-0 border border-white/50 rounded-full group-hover:border-white/80 transition-colors duration-300"></span>
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-center text-white/80 text-sm">
          © {new Date().getFullYear()} No Rights Reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;
