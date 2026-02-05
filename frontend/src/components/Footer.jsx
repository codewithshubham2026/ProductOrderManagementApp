// Import React library
import React from 'react';
// Import Link component from React Router for client-side navigation
import { Link } from 'react-router-dom';
// Import CSS module styles for footer component
import styles from '../styles/ui.module.css';
// Import Logo component to display brand logo
import Logo from './Logo';

// Footer component: displays footer with brand, links, and social media icons
// This component is always visible at the bottom of the page
export default function Footer() {
  return (
    // Footer element with CSS module styling
    <footer className={styles.footer}>
      {/* Container div with footer card styling */}
      <div className={`${styles.container} ${styles.footerCard}`}>
        {/* Inner wrapper for footer content */}
        <div className={styles.footerInner}>
          {/* Top section of footer: brand and navigation links */}
          <div className={styles.footerTop}>
            {/* Brand section: logo and company name */}
            <div className={styles.footerBrand}>
              {/* Logo component with custom size (40px) */}
              <Logo className={styles.brandIcon} size={40} />
              {/* Company name text */}
              <span>Proget Kart</span>
            </div>
            {/* Navigation links section */}
            <div className={styles.footerLinks}>
              {/* Link to products page */}
              <Link to="/" className={`${styles.linkBase} ${styles.footerLink}`}>
                Products
              </Link>
              {/* Link to orders page */}
              <Link to="/orders" className={`${styles.linkBase} ${styles.footerLink}`}>
                Orders
              </Link>
              {/* Link to AI assistant page */}
              <Link to="/ai-assistant" className={`${styles.linkBase} ${styles.footerLink}`}>
                AI Assistant
              </Link>
            </div>
          </div>
          {/* Bottom section of footer: social media links and copyright */}
          <div className={styles.footerBottom}>
            {/* Social media icons container */}
            <div className={styles.footerSocials}>
              {/* Twitter social media link */}
              <a
                href="https://twitter.com"
                // Accessibility: descriptive label for screen readers
                aria-label="Twitter"
                // Security: prevent referrer information from being passed
                rel="noreferrer"
                // Open link in new tab
                target="_blank"
                className={`${styles.linkBase} ${styles.footerSocialButton}`}
              >
                {/* Twitter icon SVG */}
                <svg viewBox="0 0 24 24" className={styles.footerSocialIcon}>
                  {/* Twitter bird icon path */}
                  <path
                    d="M20.8 7.3c.01.17.01.34.01.52 0 5.3-4.1 11.4-11.6 11.4-2.3 0-4.4-.7-6.2-1.8.3.04.6.05.9.05 1.9 0 3.7-.6 5.2-1.7-1.8 0-3.3-1.2-3.8-2.8.3.05.5.08.8.08.4 0 .7-.05 1.1-.14-1.9-.4-3.3-2-3.3-4v-.05c.6.3 1.2.5 1.9.5-1.1-.8-1.8-2.1-1.2-3.5 2 2.3 5 3.9 8.4 4.1-.5-2.1 1.1-3.9 3.1-3.9.9 0 1.7.4 2.3 1 .7-.1 1.4-.4 2-.8-.2.8-.8 1.4-1.5 1.8.6-.1 1.2-.2 1.8-.5-.4.6-.9 1.2-1.5 1.6z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              {/* GitHub social media link */}
              <a
                href="https://github.com"
                // Accessibility: descriptive label for screen readers
                aria-label="GitHub"
                // Security: prevent referrer information from being passed
                rel="noreferrer"
                // Open link in new tab
                target="_blank"
                className={`${styles.linkBase} ${styles.footerSocialButton}`}
              >
                {/* GitHub icon SVG */}
                <svg viewBox="0 0 24 24" className={styles.footerSocialIcon}>
                  {/* GitHub octocat icon path */}
                  <path
                    d="M12 2.2c-5.4 0-9.8 4.4-9.8 9.8 0 4.3 2.8 8 6.7 9.3.5.1.7-.2.7-.5v-1.8c-2.7.6-3.2-1.1-3.2-1.1-.4-1.1-1-1.4-1-1.4-.8-.6.1-.6.1-.6.9.1 1.4.9 1.4.9.8 1.4 2.1 1 2.6.8.1-.6.3-1 .6-1.2-2.2-.3-4.4-1.1-4.4-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.2.1-2.6 0 0 .8-.3 2.7 1 1.6-.4 3.4-.4 5 0 1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.3.1 2.6.6.7 1 1.6 1 2.7 0 3.8-2.3 4.6-4.5 4.9.3.3.7.9.7 1.9v2.8c0 .3.2.6.7.5 3.9-1.3 6.7-5 6.7-9.3 0-5.4-4.4-9.8-9.8-9.8z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              {/* LinkedIn social media link */}
              <a
                href="https://linkedin.com"
                // Accessibility: descriptive label for screen readers
                aria-label="LinkedIn"
                // Security: prevent referrer information from being passed
                rel="noreferrer"
                // Open link in new tab
                target="_blank"
                className={`${styles.linkBase} ${styles.footerSocialButton}`}
              >
                {/* LinkedIn icon SVG */}
                <svg viewBox="0 0 24 24" className={styles.footerSocialIcon}>
                  {/* LinkedIn icon path */}
                  <path
                    d="M6.9 8.5H3.4v12h3.5v-12zm-1.7-5c-1.1 0-1.9.8-1.9 1.8 0 1 .8 1.8 1.9 1.8s1.9-.8 1.9-1.8c0-1-.8-1.8-1.9-1.8zm15.3 9.6c0-3.1-1.6-4.6-3.8-4.6-1.7 0-2.5 1-2.9 1.6V8.5h-3.4v12h3.4v-6.4c0-1.7.3-3.3 2.4-3.3 2 0 2 1.9 2 3.4v6.3H20.5v-7.4z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
            {/* Copyright notice */}
            <div className={styles.footerMeta}>© 2026 Proget Kart. All rights reserved.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
