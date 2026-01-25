import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from '../styles/ui.module.css';

export default function Select({
  value,
  onChange,
  options,
  placeholder = 'Select',
  disabled = false,
  variant,
  ariaLabel
}) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const listRef = useRef(null);
  const [listStyle, setListStyle] = useState({});
  const [portalRoot, setPortalRoot] = useState(null);
  const listId = useId();

  const selectedIndex = options.findIndex((option) => option.value === value);
  const hasSelection = selectedIndex >= 0;
  const selectedOption = hasSelection
    ? options[selectedIndex]
    : { label: placeholder, value: '' };

  useEffect(() => {
    setHighlightedIndex(hasSelection ? selectedIndex : 0);
  }, [hasSelection, selectedIndex]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isInRoot = rootRef.current?.contains(event.target);
      const isInList = listRef.current?.contains(event.target);
      if (!isInRoot && !isInList) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const appShell = document.querySelector(`.${styles.appShell}`);
    setPortalRoot(appShell || document.body);
  }, []);

  useEffect(() => {
    if (!open) return;
    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setListStyle({
        position: 'fixed',
        top: rect.bottom + 10,
        left: rect.left,
        width: rect.width,
        zIndex: 10000
      });
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open]);

  const handleSelect = (option) => {
    if (option.value !== value) {
      onChange(option.value);
    }
    setOpen(false);
  };

  const handleKeyDown = (event) => {
    if (disabled) return;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setOpen(true);
        setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setOpen(true);
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Home':
        event.preventDefault();
        setHighlightedIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setHighlightedIndex(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (open) {
          if (options[highlightedIndex]) {
            handleSelect(options[highlightedIndex]);
          }
        } else {
          setOpen(true);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={rootRef}
      className={`${styles.select}${variant ? ` ${styles[`select-${variant}`]}` : ''}`}
    >
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.buttonBase} ${styles.selectTrigger}${open ? ` ${styles.open}` : ''}`}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleKeyDown}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-label={ariaLabel || placeholder}
        disabled={disabled}
      >
        <span
          className={`${styles.selectValue}${selectedOption.value ? '' : ` ${styles.muted}`}`}
        >
          {selectedOption.label || placeholder}
        </span>
        <span className={styles.selectIcon} aria-hidden="true">
          <svg viewBox="0 0 20 20" className={styles.selectIconSvg}>
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
      {portalRoot &&
        createPortal(
          <div
            id={listId}
            ref={listRef}
            role="listbox"
            className={`${styles.selectList}${open ? ` ${styles.open}` : ''}`}
            tabIndex={-1}
            style={listStyle}
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              return (
                <div
                  key={option.value || option.label}
                  role="option"
                  aria-selected={isSelected}
                  className={`${styles.selectOption}${
                    isSelected ? ` ${styles.selected}` : ''
                  }`}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </div>
              );
            })}
          </div>,
          portalRoot
        )}
    </div>
  );
}
