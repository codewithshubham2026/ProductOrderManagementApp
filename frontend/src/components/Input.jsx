import React from 'react';
import styles from '../styles/ui.module.css';

const Input = React.forwardRef(function Input({ variant, className, ...props }, ref) {
  const variantClass = variant
    ? styles[`input${variant.charAt(0).toUpperCase()}${variant.slice(1)}`]
    : '';
  const classes = [
    styles.inputBase,
    styles.inputField,
    variantClass,
    className || ''
  ]
    .filter(Boolean)
    .join(' ');

  return <input {...props} ref={ref} className={classes} />;
});

export default Input;
