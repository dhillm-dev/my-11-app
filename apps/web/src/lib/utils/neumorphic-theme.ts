/**
 * PickNWin Neumorphic Theme Utilities
 * Inspired by ui-neumorphism's theming system
 */

export interface NeumorphicThemeVariables {
  // Background colors
  '--neu-bg-color'?: string;
  '--neu-bg-light-shadow'?: string;
  '--neu-bg-dark-shadow'?: string;
  '--neu-text-color'?: string;
  '--neu-text-secondary'?: string;
  '--neu-border-color'?: string;
  
  // Primary colors
  '--neu-primary'?: string;
  '--neu-primary-light'?: string;
  '--neu-primary-dark'?: string;
  
  // Success colors
  '--neu-success'?: string;
  '--neu-success-light'?: string;
  '--neu-success-dark'?: string;
  
  // Warning colors
  '--neu-warning'?: string;
  '--neu-warning-light'?: string;
  '--neu-warning-dark'?: string;
  
  // Danger colors
  '--neu-danger'?: string;
  '--neu-danger-light'?: string;
  '--neu-danger-dark'?: string;
  
  // Border radius
  '--neu-radius-sm'?: string;
  '--neu-radius-md'?: string;
  '--neu-radius-lg'?: string;
  '--neu-radius-xl'?: string;
  '--neu-radius-2xl'?: string;
}

/**
 * Override theme variables dynamically
 * Similar to ui-neumorphism's overrideThemeVariables function
 * @param variables - Object containing CSS custom property key-value pairs
 * @param target - Target element (defaults to document.documentElement)
 */
export function overrideThemeVariables(
  variables: NeumorphicThemeVariables,
  target: HTMLElement = document.documentElement
): void {
  Object.entries(variables).forEach(([key, value]) => {
    if (value !== undefined) {
      target.style.setProperty(key, value);
    }
  });
}

/**
 * Get current theme variable value
 * @param variable - CSS custom property name
 * @param target - Target element (defaults to document.documentElement)
 * @returns Current value of the CSS custom property
 */
export function getThemeVariable(
  variable: keyof NeumorphicThemeVariables,
  target: HTMLElement = document.documentElement
): string {
  return getComputedStyle(target).getPropertyValue(variable).trim();
}

/**
 * Reset theme variables to default values
 * @param target - Target element (defaults to document.documentElement)
 */
export function resetThemeVariables(
  target: HTMLElement = document.documentElement
): void {
  const defaultVariables: NeumorphicThemeVariables = {
    '--neu-bg-color': '#e0e5ec',
    '--neu-bg-light-shadow': '#ffffff',
    '--neu-bg-dark-shadow': '#a3b1c6',
    '--neu-text-color': '#2d3748',
    '--neu-text-secondary': '#4a5568',
    '--neu-border-color': '#cbd5e0',
    '--neu-primary': '#4299e1',
    '--neu-primary-light': '#63b3ed',
    '--neu-primary-dark': '#3182ce',
    '--neu-success': '#48bb78',
    '--neu-success-light': '#68d391',
    '--neu-success-dark': '#38a169',
    '--neu-warning': '#ed8936',
    '--neu-warning-light': '#f6ad55',
    '--neu-warning-dark': '#dd6b20',
    '--neu-danger': '#f56565',
    '--neu-danger-light': '#fc8181',
    '--neu-danger-dark': '#e53e3e',
    '--neu-radius-sm': '8px',
    '--neu-radius-md': '12px',
    '--neu-radius-lg': '16px',
    '--neu-radius-xl': '20px',
    '--neu-radius-2xl': '24px'
  };
  
  overrideThemeVariables(defaultVariables, target);
}

/**
 * Predefined theme presets
 */
export const themePresets = {
  // Light themes
  default: {
    '--neu-bg-color': '#e0e5ec',
    '--neu-bg-light-shadow': '#ffffff',
    '--neu-bg-dark-shadow': '#a3b1c6',
    '--neu-text-color': '#2d3748',
    '--neu-text-secondary': '#4a5568'
  },
  
  warm: {
    '--neu-bg-color': '#f7f3f0',
    '--neu-bg-light-shadow': '#ffffff',
    '--neu-bg-dark-shadow': '#d4c4b0',
    '--neu-text-color': '#8b4513',
    '--neu-text-secondary': '#a0522d'
  },
  
  cool: {
    '--neu-bg-color': '#e8f4f8',
    '--neu-bg-light-shadow': '#ffffff',
    '--neu-bg-dark-shadow': '#b8d4da',
    '--neu-text-color': '#2c5282',
    '--neu-text-secondary': '#3182ce'
  },
  
  // Dark themes
  dark: {
    '--neu-bg-color': '#2d3748',
    '--neu-bg-light-shadow': '#4a5568',
    '--neu-bg-dark-shadow': '#1a202c',
    '--neu-text-color': '#f7fafc',
    '--neu-text-secondary': '#e2e8f0'
  },
  
  darkWarm: {
    '--neu-bg-color': '#3c2415',
    '--neu-bg-light-shadow': '#5a3a2a',
    '--neu-bg-dark-shadow': '#2a1810',
    '--neu-text-color': '#f7e6d3',
    '--neu-text-secondary': '#e6d0b8'
  },
  
  darkCool: {
    '--neu-bg-color': '#1e3a5f',
    '--neu-bg-light-shadow': '#2d5a87',
    '--neu-bg-dark-shadow': '#0f1c2e',
    '--neu-text-color': '#e6f3ff',
    '--neu-text-secondary': '#b8e0ff'
  }
} as const;

/**
 * Apply a predefined theme preset
 * @param preset - Theme preset name
 * @param target - Target element (defaults to document.documentElement)
 */
export function applyThemePreset(
  preset: keyof typeof themePresets,
  target: HTMLElement = document.documentElement
): void {
  overrideThemeVariables(themePresets[preset], target);
}

/**
 * Generate complementary colors for a base color
 * @param baseColor - Base color in hex format
 * @returns Object with light and dark variants
 */
export function generateColorVariants(baseColor: string): {
  light: string;
  dark: string;
} {
  // Simple color manipulation (in a real app, you might use a color library)
  const hex = baseColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Generate lighter variant
  const lightR = Math.min(255, Math.floor(r + (255 - r) * 0.3));
  const lightG = Math.min(255, Math.floor(g + (255 - g) * 0.3));
  const lightB = Math.min(255, Math.floor(b + (255 - b) * 0.3));
  
  // Generate darker variant
  const darkR = Math.max(0, Math.floor(r * 0.7));
  const darkG = Math.max(0, Math.floor(g * 0.7));
  const darkB = Math.max(0, Math.floor(b * 0.7));
  
  return {
    light: `#${lightR.toString(16).padStart(2, '0')}${lightG.toString(16).padStart(2, '0')}${lightB.toString(16).padStart(2, '0')}`,
    dark: `#${darkR.toString(16).padStart(2, '0')}${darkG.toString(16).padStart(2, '0')}${darkB.toString(16).padStart(2, '0')}`
  };
}

/**
 * Create a custom theme with a primary color
 * @param primaryColor - Primary color in hex format
 * @param options - Additional theme options
 */
export function createCustomTheme(
  primaryColor: string,
  options: {
    isDark?: boolean;
    backgroundTint?: string;
  } = {}
): NeumorphicThemeVariables {
  const { light, dark } = generateColorVariants(primaryColor);
  const { isDark = false, backgroundTint } = options;
  
  const baseTheme = isDark ? themePresets.dark : themePresets.default;
  
  return {
    ...baseTheme,
    '--neu-primary': primaryColor,
    '--neu-primary-light': light,
    '--neu-primary-dark': dark,
    ...(backgroundTint && { '--neu-bg-color': backgroundTint })
  };
}

/**
 * Theme manager class for advanced theme handling
 */
export class NeumorphicThemeManager {
  private currentTheme: NeumorphicThemeVariables = {};
  private target: HTMLElement;
  
  constructor(target: HTMLElement = document.documentElement) {
    this.target = target;
  }
  
  /**
   * Set theme variables
   */
  setTheme(variables: NeumorphicThemeVariables): void {
    this.currentTheme = { ...this.currentTheme, ...variables };
    overrideThemeVariables(variables, this.target);
  }
  
  /**
   * Get current theme
   */
  getCurrentTheme(): NeumorphicThemeVariables {
    return { ...this.currentTheme };
  }
  
  /**
   * Reset to default theme
   */
  reset(): void {
    resetThemeVariables(this.target);
    this.currentTheme = {};
  }
  
  /**
   * Apply preset
   */
  applyPreset(preset: keyof typeof themePresets): void {
    const presetVariables = themePresets[preset];
    this.setTheme(presetVariables);
  }
  
  /**
   * Toggle between light and dark theme
   */
  toggleDarkMode(): void {
    const isDark = this.target.classList.contains('dark') || 
                   this.target.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
      this.applyPreset('default');
      this.target.classList.remove('dark');
      this.target.removeAttribute('data-theme');
    } else {
      this.applyPreset('dark');
      this.target.classList.add('dark');
      this.target.setAttribute('data-theme', 'dark');
    }
  }
}

// Export a default theme manager instance
export const defaultThemeManager = new NeumorphicThemeManager();