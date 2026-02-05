// Import React hooks: useEffect for side effects, useId for unique IDs, useRef for DOM references, useState for state
import React, { useEffect, useId, useRef, useState } from 'react';
// Import createPortal from React DOM for rendering dropdown outside normal DOM hierarchy
import { createPortal } from 'react-dom';
// Import CSS module styles for select component
import styles from '../styles/ui.module.css';

// Select component: custom accessible dropdown select with keyboard navigation
// This is a fully custom select component (not using native <select>)
// value: currently selected option value
// onChange: callback function when selection changes
// options: array of { value, label } objects
// placeholder: text to show when no option is selected
// disabled: whether the select is disabled
// variant: optional variant for styling
// ariaLabel: accessibility label for screen readers
export default function Select({
  value,
  onChange,
  options,
  placeholder = 'Select',
  disabled = false,
  variant,
  ariaLabel
}) {
  // State to track if dropdown is open or closed
  const [open, setOpen] = useState(false);
  // State to track which option is currently highlighted (for keyboard navigation)
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  // Ref to root container element (for click outside detection)
  const rootRef = useRef(null);
  // Ref to trigger button element (for positioning dropdown)
  const triggerRef = useRef(null);
  // Ref to dropdown list element (for click outside detection)
  const listRef = useRef(null);
  // State to store calculated position styles for dropdown list
  const [listStyle, setListStyle] = useState({});
  // State to store DOM element where dropdown will be portaled (app shell or body)
  const [portalRoot, setPortalRoot] = useState(null);
  // Generate unique ID for dropdown list (for accessibility)
  const listId = useId();

  // Find index of currently selected option in options array
  const selectedIndex = options.findIndex((option) => option.value === value);
  // Check if an option is currently selected
  const hasSelection = selectedIndex >= 0;
  // Get the selected option object, or use placeholder if none selected
  const selectedOption = hasSelection
    ? options[selectedIndex]
    : { label: placeholder, value: '' };

  // useEffect to update highlighted index when selection changes
  // This ensures keyboard navigation starts from the selected option
  useEffect(() => {
    setHighlightedIndex(hasSelection ? selectedIndex : 0);
  }, [hasSelection, selectedIndex]); // Re-run when selection changes

  // useEffect to handle clicking outside dropdown to close it
  // Runs once on component mount
  useEffect(() => {
    // Event handler function that closes dropdown when clicking outside
    const handleClickOutside = (event) => {
      // Check if click was inside root container
      const isInRoot = rootRef.current?.contains(event.target);
      // Check if click was inside dropdown list (portaled element)
      const isInList = listRef.current?.contains(event.target);
      // If click was outside both, close the dropdown
      if (!isInRoot && !isInList) {
        setOpen(false);
      }
    };
    // Add event listener to document
    document.addEventListener('mousedown', handleClickOutside);
    // Cleanup: remove event listener on unmount
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); // Empty dependency array: run only once on mount

  // useEffect to find portal root element (where dropdown will be rendered)
  // Runs once on component mount
  useEffect(() => {
    // Check if document exists (SSR safety check)
    if (typeof document === 'undefined') return;
    // Try to find app shell element, fallback to body
    const appShell = document.querySelector(`.${styles.appShell}`);
    // Set portal root to app shell or body
    setPortalRoot(appShell || document.body);
  }, []); // Empty dependency array: run only once on mount

  // useEffect to calculate and update dropdown position when it opens
  // Runs whenever dropdown opens/closes
  useEffect(() => {
    // If dropdown is closed, don't calculate position
    if (!open) return;
    // Function to calculate dropdown position based on trigger button position
    const updatePosition = () => {
      // Get bounding rectangle of trigger button
      const rect = triggerRef.current?.getBoundingClientRect();
      // If trigger not found, exit
      if (!rect) return;
      // Set dropdown position: below trigger button with 10px gap
      setListStyle({
        position: 'fixed', // Fixed positioning relative to viewport
        top: rect.bottom + 10, // Position below trigger button
        left: rect.left, // Align left edge with trigger
        width: rect.width, // Match trigger width
        zIndex: 10000 // High z-index to appear above other content
      });
    };
    // Calculate position immediately when dropdown opens
    updatePosition();
    // Add event listeners to recalculate position on window resize
    window.addEventListener('resize', updatePosition);
    // Add event listener to recalculate position on scroll (capture phase)
    window.addEventListener('scroll', updatePosition, true);
    // Cleanup: remove event listeners when dropdown closes or component unmounts
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open]); // Re-run when open state changes

  // Handler function when user selects an option
  const handleSelect = (option) => {
    // Only call onChange if the value actually changed (prevents unnecessary updates)
    if (option.value !== value) {
      onChange(option.value);
    }
    // Close dropdown after selection
    setOpen(false);
  };

  // Keyboard navigation handler for accessibility
  // Implements ARIA keyboard patterns for dropdowns
  const handleKeyDown = (event) => {
    // If disabled, ignore all keyboard input
    if (disabled) return;
    // Switch statement to handle different key presses
    switch (event.key) {
      // Arrow Down: move highlight down or open dropdown
      case 'ArrowDown':
        event.preventDefault(); // Prevent page scroll
        setOpen(true); // Open dropdown if closed
        // Move highlight down, but don't go past last option
        setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1));
        break;
      // Arrow Up: move highlight up or open dropdown
      case 'ArrowUp':
        event.preventDefault(); // Prevent page scroll
        setOpen(true); // Open dropdown if closed
        // Move highlight up, but don't go before first option
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        break;
      // Home key: jump to first option
      case 'Home':
        event.preventDefault();
        setHighlightedIndex(0);
        break;
      // End key: jump to last option
      case 'End':
        event.preventDefault();
        setHighlightedIndex(options.length - 1);
        break;
      // Enter or Space: select highlighted option or open dropdown
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (open) {
          // If dropdown is open, select the highlighted option
          if (options[highlightedIndex]) {
            handleSelect(options[highlightedIndex]);
          }
        } else {
          // If dropdown is closed, open it
          setOpen(true);
        }
        break;
      // Escape key: close dropdown
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        break;
      // Other keys: do nothing
      default:
        break;
    }
  };

  // Return JSX for select component
  return (
    // Root container with ref for click outside detection
    <div
      ref={rootRef}
      className={`${styles.select}${variant ? ` ${styles[`select-${variant}`]}` : ''}`}
    >
      {/* Trigger button that opens/closes dropdown */}
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.buttonBase} ${styles.selectTrigger}${open ? ` ${styles.open}` : ''}`}
        // Toggle dropdown open/closed on click
        onClick={() => setOpen((current) => !current)}
        // Handle keyboard navigation
        onKeyDown={handleKeyDown}
        // Accessibility: indicate if dropdown is expanded
        aria-expanded={open}
        // Accessibility: indicate this button opens a listbox
        aria-haspopup="listbox"
        // Accessibility: reference to the listbox element
        aria-controls={listId}
        // Accessibility: descriptive label
        aria-label={ariaLabel || placeholder}
        // Disable button if select is disabled
        disabled={disabled}
      >
        {/* Display selected option label or placeholder */}
        <span
          className={`${styles.selectValue}${selectedOption.value ? '' : ` ${styles.muted}`}`}
        >
          {selectedOption.label || placeholder}
        </span>
        {/* Dropdown arrow icon */}
        <span className={styles.selectIcon} aria-hidden="true">
          <svg viewBox="0 0 20 20" className={styles.selectIconSvg}>
            {/* Chevron down icon path */}
            <path
              d="M5 7l5 5 5-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {/* Render dropdown list using portal (renders outside normal DOM hierarchy) */}
      {/* Only render if portalRoot is available */}
      {portalRoot &&
        createPortal(
          // Dropdown list container
          <div
            id={listId}
            ref={listRef}
            role="listbox"
            className={`${styles.selectList}${open ? ` ${styles.open}` : ''}`}
            tabIndex={-1}
            style={listStyle}
          >
            {/* Map through options to create option elements */}
            {options.map((option, index) => {
              // Check if this option is currently selected
              const isSelected = option.value === value;
              return (
                // Individual option element
                <div
                  key={option.value || option.label}
                  role="option"
                  aria-selected={isSelected}
                  className={`${styles.selectOption}${
                    isSelected ? ` ${styles.selected}` : ''
                  }`}
                  // Update highlighted index when mouse enters option
                  onMouseEnter={() => setHighlightedIndex(index)}
                  // Select option when clicked
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </div>
              );
            })}
          </div>,
          portalRoot // Portal target: render dropdown here instead of in normal flow
        )}
    </div>
  );
}
