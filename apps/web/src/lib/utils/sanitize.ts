import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string safe for rendering
 */
export const safeHtml = (html: string): string => {
	return DOMPurify.sanitize(html, { 
		USE_PROFILES: { html: true },
		ALLOW_UNKNOWN_PROTOCOLS: false,
		KEEP_CONTENT: false
	});
};

/**
 * Sanitizes HTML content with custom configuration
 * @param html - The HTML string to sanitize
 * @param config - Custom DOMPurify configuration
 * @returns Sanitized HTML string
 */
export const sanitizeHtml = (html: string, config?: DOMPurify.Config): string => {
	return DOMPurify.sanitize(html, config);
};