/**
 * Utility functions for handling language display
 */

/**
 * Get the language display text based on available languages
 * @param {Object} content - The podcast or newsletter object
 * @returns {string} - The language display text
 */
export function getLanguageDisplayText(content) {
  if (!content) return '';
  
  const { available_in_english, available_in_spanish } = content;
  
  if (available_in_english && available_in_spanish) {
    return 'English/Spanish';
  } else if (available_in_english) {
    return 'English';
  } else if (available_in_spanish) {
    return 'Spanish';
  } else {
    return 'English'; // Default fallback
  }
}

/**
 * Get the language icon class based on available languages
 * @param {Object} content - The podcast or newsletter object
 * @returns {string} - The icon class name
 */
export function getLanguageIconClass(content) {
  if (!content) return 'mi-language size-16';
  
  const { available_in_english, available_in_spanish } = content;
  
  if (available_in_english && available_in_spanish) {
    return 'mi-language size-16'; // For multilingual content
  } else if (available_in_english) {
    return 'mi-language size-16'; // For English content
  } else if (available_in_spanish) {
    return 'mi-language size-16'; // For Spanish content
  } else {
    return 'mi-language size-16'; // Default fallback
  }
} 