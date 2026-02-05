// Import React library
import React from 'react';
// Import CSS module styles for input component
import styles from '../styles/ui.module.css';

// Input component: reusable styled input field with variant support
// React.forwardRef allows parent components to access the input element via ref
// This is useful for focusing inputs programmatically
const Input = React.forwardRef(function Input({ variant, className, ...props }, ref) {
  // Generate variant class name dynamically if variant prop is provided
  // Example: variant="search" becomes "inputSearch" class
  // charAt(0).toUpperCase() capitalizes first letter, slice(1) gets rest
  const variantClass = variant
    ? styles[`input${variant.charAt(0).toUpperCase()}${variant.slice(1)}`]
    : '';
  // Combine all CSS classes: base styles, field styles, variant class, and custom className
  // filter(Boolean) removes any empty strings from the array
  // join(' ') combines all classes into a single space-separated string
  const classes = [
    styles.inputBase,
    styles.inputField,
    variantClass,
    className || ''
  ]
    .filter(Boolean)
    .join(' ');

  // Return input element with all props spread, ref forwarded, and combined classes
  // {...props} spreads all other props (type, value, onChange, placeholder, etc.)
  return <input {...props} ref={ref} className={classes} />;
});

// Export Input component as default export
export default Input;
