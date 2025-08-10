/**
 * Utility functions for safely rendering HTML content from rich text editors
 */

/**
 * Safely render HTML content by creating a sanitized HTML string
 * This function ensures that only safe HTML tags are rendered
 * @param {string} htmlContent - The HTML content from the rich text editor
 * @returns {string} - Sanitized HTML string
 */
export const renderSafeHTML = (htmlContent) => {
  if (!htmlContent) return '';
  
  // Basic sanitization - allow common safe HTML tags
  const allowedTags = [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'strike', 'del',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'div', 'span'
  ];
  
  const allowedAttributes = {
    'a': ['href', 'target', 'rel'],
    'img': ['src', 'alt', 'title', 'width', 'height'],
    'table': ['border', 'cellpadding', 'cellspacing'],
    'td': ['colspan', 'rowspan'],
    'th': ['colspan', 'rowspan']
  };
  
  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  // Recursively sanitize the DOM tree
  const sanitizeNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();
      
      // Remove disallowed tags
      if (!allowedTags.includes(tagName)) {
        return node.textContent;
      }
      
      // Build the sanitized element
      let sanitizedElement = `<${tagName}`;
      
      // Add allowed attributes
      if (allowedAttributes[tagName]) {
        for (const attr of allowedAttributes[tagName]) {
          if (node.hasAttribute(attr)) {
            const value = node.getAttribute(attr);
            // Basic attribute value sanitization
            if (attr === 'href' && !value.startsWith('http://') && !value.startsWith('https://') && !value.startsWith('mailto:') && !value.startsWith('tel:')) {
              continue; // Skip potentially dangerous href values
            }
            sanitizedElement += ` ${attr}="${value.replace(/"/g, '&quot;')}"`;
          }
        }
      }
      
      sanitizedElement += '>';
      
      // Process child nodes
      for (const child of node.childNodes) {
        sanitizedElement += sanitizeNode(child);
      }
      
      sanitizedElement += `</${tagName}>`;
      return sanitizedElement;
    }
    
    return '';
  };
  
  // Sanitize the entire content
  let sanitizedContent = '';
  for (const child of tempDiv.childNodes) {
    sanitizedContent += sanitizeNode(child);
  }
  
  return sanitizedContent;
};

/**
 * Create a React component that safely renders HTML content
 * @param {string} htmlContent - The HTML content to render
 * @param {string} className - Optional CSS class name
 * @returns {JSX.Element} - React element with dangerouslySetInnerHTML
 */
export const SafeHTMLRenderer = ({ content, className = '', ...props }) => {
  const sanitizedContent = renderSafeHTML(content);
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      {...props}
    />
  );
};

/**
 * Truncate HTML content while preserving HTML structure
 * @param {string} htmlContent - The HTML content to truncate
 * @param {number} maxLength - Maximum number of characters
 * @returns {string} - Truncated HTML content
 */
export const truncateHTML = (htmlContent, maxLength = 150) => {
  if (!htmlContent) return '';
  
  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  const textContent = tempDiv.textContent || tempDiv.innerText || '';
  
  if (textContent.length <= maxLength) {
    return htmlContent;
  }
  
  // Truncate the text content
  const truncatedText = textContent.substring(0, maxLength).trim();
  
  // Find the last complete word
  const lastSpaceIndex = truncatedText.lastIndexOf(' ');
  const finalText = lastSpaceIndex > 0 ? truncatedText.substring(0, lastSpaceIndex) : truncatedText;
  
  return finalText + '...';
};

/**
 * Strip HTML tags and return plain text
 * @param {string} htmlContent - The HTML content to strip
 * @returns {string} - Plain text content
 */
export const stripHTML = (htmlContent) => {
  if (!htmlContent) return '';
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  return tempDiv.textContent || tempDiv.innerText || '';
}; 