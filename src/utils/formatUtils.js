/**
 * Capitalizes the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} - The capitalized string
 */
export const capitalizeFirst = (str) => {
  if (!str || typeof str !== 'string') return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Formats city or state to have first letter capitalized
 * @param {string} value - The city or state value
 * @param {string} defaultValue - Default value if value is empty
 * @returns {string} - Formatted city/state
 */
export const formatLocation = (value, defaultValue = '') => {
  if (!value) return defaultValue;
  return capitalizeFirst(value);
};
