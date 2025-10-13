// ===== THEME MANAGEMENT =====

/**
 * Theme Manager - Handles light/dark mode switching
 */
const themeManager = {
    // Theme constants
    THEMES: {
        LIGHT: 'light',
        DARK: 'dark'
    },

    // Storage key for persisting theme preference
    STORAGE_KEY: 'vinilos-plus-theme',

    /**
     * Initialize theme management
     */
    init() {
        this.loadSavedTheme();
        this.setupEventListeners();
        this.updateThemeIcon();
    },

    /**
     * Get current theme
     * @returns {string} Current theme (light or dark)
     */
    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || this.THEMES.LIGHT;
    },

    /**
     * Set theme
     * @param {string} theme - Theme to set (light or dark)
     */
    setTheme(theme) {
        if (theme === this.THEMES.DARK) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        
        // Save theme preference
        this.saveThemePreference(theme);
        this.updateThemeIcon();
        
        // Dispatch custom event for other components
        this.dispatchThemeChangeEvent(theme);
    },

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        const currentTheme = this.getCurrentTheme();
        const newTheme = currentTheme === this.THEMES.LIGHT 
            ? this.THEMES.DARK 
            : this.THEMES.LIGHT;
        
        this.setTheme(newTheme);
    },

    /**
     * Load saved theme from localStorage
     */
    loadSavedTheme() {
        try {
            const savedTheme = localStorage.getItem(this.STORAGE_KEY);
            if (savedTheme && Object.values(this.THEMES).includes(savedTheme)) {
                this.setTheme(savedTheme);
            } else {
                // Default to light theme if no saved preference
                this.setTheme(this.THEMES.LIGHT);
            }
        } catch (error) {
            console.warn('Failed to load theme preference:', error);
            this.setTheme(this.THEMES.LIGHT);
        }
    },

    /**
     * Save theme preference to localStorage
     * @param {string} theme - Theme to save
     */
    saveThemePreference(theme) {
        try {
            localStorage.setItem(this.STORAGE_KEY, theme);
        } catch (error) {
            console.warn('Failed to save theme preference:', error);
        }
    },

    /**
     * Update theme toggle button icon
     */
    updateThemeIcon() {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            const currentTheme = this.getCurrentTheme();
            themeIcon.textContent = currentTheme === this.THEMES.DARK ? '☀️' : '🌙';
            
            // Update button title
            const themeButton = document.getElementById('themeToggle');
            if (themeButton) {
                themeButton.title = currentTheme === this.THEMES.DARK 
                    ? 'Cambiar a modo claro' 
                    : 'Cambiar a modo oscuro';
            }
        }
    },

    /**
     * Setup event listeners for theme toggle
     */
    setupEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });

            // Add keyboard support
            themeToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }

        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addListener(() => {
                // Only auto-switch if user hasn't manually set a preference
                if (!localStorage.getItem(this.STORAGE_KEY)) {
                    const systemTheme = mediaQuery.matches ? this.THEMES.DARK : this.THEMES.LIGHT;
                    this.setTheme(systemTheme);
                }
            });
        }
    },

    /**
     * Dispatch custom theme change event
     * @param {string} theme - New theme
     */
    dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('themeChanged', {
            detail: { theme }
        });
        document.dispatchEvent(event);
    },

    /**
     * Get system preferred theme
     * @returns {string} System preferred theme
     */
    getSystemPreferredTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return this.THEMES.DARK;
        }
        return this.THEMES.LIGHT;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = themeManager;
}