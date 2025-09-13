<script lang="ts">
	import { Button } from '$lib/components/ui';
	import { 
		overrideThemeVariables, 
		applyThemePreset, 
		themePresets, 
		createCustomTheme,
		defaultThemeManager,
		type NeumorphicThemeVariables 
	} from '$lib/utils/neumorphic-theme';
	import { onMount } from 'svelte';

	// Theme state
	let currentPreset = 'default';
	let customPrimaryColor = '#4299e1';
	let isDarkMode = false;

	// Demo states
	let isPressed = false;
	let showCustomTheme = false;

	// Apply theme preset
	function handlePresetChange(preset: keyof typeof themePresets) {
		currentPreset = preset;
		applyThemePreset(preset);
		isDarkMode = preset.includes('dark');
	}

	// Apply custom theme
	function applyCustomTheme() {
		const customTheme = createCustomTheme(customPrimaryColor, { isDark: isDarkMode });
		overrideThemeVariables(customTheme);
		showCustomTheme = true;
	}

	// Toggle dark mode
	function toggleDarkMode() {
		defaultThemeManager.toggleDarkMode();
		isDarkMode = !isDarkMode;
	}

	// Reset to default theme
	function resetTheme() {
		defaultThemeManager.reset();
		currentPreset = 'default';
		isDarkMode = false;
		showCustomTheme = false;
	}

	// Example of dynamic theme override (like ui-neumorphism)
	function applyDynamicTheme() {
		overrideThemeVariables({
			'--neu-bg-color': '#E9B7B9',
			'--neu-bg-dark-shadow': '#ba9294',
			'--neu-bg-light-shadow': '#ffdcde',
			'--neu-primary': '#d63384',
			'--neu-primary-light': '#e85d9a',
			'--neu-primary-dark': '#b02a5b'
		});
		showCustomTheme = true;
	}

	onMount(() => {
		// Initialize with default theme
		applyThemePreset('default');
	});
</script>

<svelte:head>
	<title>Neumorphic Design System - PickNWin</title>
</svelte:head>

<div class="min-h-screen neu-base transition-all duration-500 p-8">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="text-center mb-12">
			<h1 class="text-5xl font-bold mb-4" style="color: var(--neu-text-color)">Neumorphic Design System</h1>
			<p class="text-xl" style="color: var(--neu-text-secondary)">Inspired by ui-neumorphism, built for Svelte</p>
			<div class="mt-6 flex flex-wrap justify-center gap-4">
				<Button variant="neumorphic-primary" on:click={toggleDarkMode}>
					{isDarkMode ? '☀️' : '🌙'} Toggle Theme
				</Button>
				<Button variant="neumorphic" on:click={resetTheme}>🔄 Reset</Button>
			</div>
		</div>

		<!-- Theme Controls -->
		<div class="neu-card mb-12">
			<h2 class="text-3xl font-bold mb-6" style="color: var(--neu-text-color)">Theme Controls</h2>
			
			<!-- Preset Themes -->
			<div class="mb-8">
				<h3 class="text-xl font-semibold mb-4" style="color: var(--neu-text-color)">Preset Themes</h3>
				<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
					{#each Object.keys(themePresets) as preset}
						<Button 
							variant={currentPreset === preset ? 'neumorphic-pressed' : 'neumorphic'}
							size="sm"
							on:click={() => handlePresetChange(preset)}
						>
							{preset}
						</Button>
					{/each}
				</div>
			</div>

			<!-- Custom Theme -->
			<div class="mb-8">
				<h3 class="text-xl font-semibold mb-4" style="color: var(--neu-text-color)">Custom Theme</h3>
				<div class="flex flex-wrap items-center gap-4">
					<div class="flex items-center gap-2">
						<label style="color: var(--neu-text-secondary)">Primary Color:</label>
						<input 
							type="color" 
							bind:value={customPrimaryColor}
							class="neu-input w-16 h-10 p-1 cursor-pointer"
						/>
					</div>
					<Button variant="neumorphic-success" on:click={applyCustomTheme}>
						Apply Custom
					</Button>
					<Button variant="neumorphic-warning" on:click={applyDynamicTheme}>
						Pink Theme (ui-neumorphism example)
					</Button>
				</div>
			</div>

			{#if showCustomTheme}
				<div class="neu-card-sm bg-green-50 border-green-200">
					<p class="text-green-800">✅ Custom theme applied! This demonstrates the overrideThemeVariables() function similar to ui-neumorphism.</p>
				</div>
			{/if}
		</div>

		<!-- Button Variants -->
		<div class="neu-card mb-12">
			<h2 class="text-3xl font-bold mb-6" style="color: var(--neu-text-color)">Button Variants</h2>
			
			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
				<!-- Basic Neumorphic -->
				<div class="neu-card-sm">
					<h3 class="text-lg font-semibold mb-4" style="color: var(--neu-text-color)">Basic Neumorphic</h3>
					<div class="space-y-3">
						<Button variant="neumorphic">Default</Button>
						<Button variant="neumorphic" disabled>Disabled</Button>
						<Button variant="neumorphic-flat">Flat</Button>
						<Button variant="neumorphic-raised">Raised</Button>
					</div>
				</div>

				<!-- Color Variants -->
				<div class="neu-card-sm">
					<h3 class="text-lg font-semibold mb-4" style="color: var(--neu-text-color)">Color Variants</h3>
					<div class="space-y-3">
						<Button variant="neumorphic-primary">Primary</Button>
						<Button variant="neumorphic-success">Success</Button>
						<Button variant="neumorphic-warning">Warning</Button>
						<Button variant="neumorphic-danger">Danger</Button>
					</div>
				</div>

				<!-- Sizes -->
				<div class="neu-card-sm">
					<h3 class="text-lg font-semibold mb-4" style="color: var(--neu-text-color)">Sizes</h3>
					<div class="space-y-3">
						<Button variant="neumorphic-primary" size="sm">Small</Button>
						<Button variant="neumorphic-primary">Default</Button>
						<Button variant="neumorphic-primary" size="lg">Large</Button>
						<Button variant="neumorphic-primary" size="xl">Extra Large</Button>
					</div>
				</div>

				<!-- Interactive States -->
				<div class="neu-card-sm">
					<h3 class="text-lg font-semibold mb-4" style="color: var(--neu-text-color)">Interactive States</h3>
					<div class="space-y-3">
						<Button 
							variant={isPressed ? 'neumorphic-pressed' : 'neumorphic'}
							on:click={() => isPressed = !isPressed}
						>
							{isPressed ? 'Pressed' : 'Click Me'}
						</Button>
						<Button variant="neumorphic" class="neu-pulse">Pulsing</Button>
						<Button variant="neumorphic" class="neu-bounce">Bouncing</Button>
					</div>
				</div>

				<!-- Traditional Variants -->
				<div class="neu-card-sm">
					<h3 class="text-lg font-semibold mb-4" style="color: var(--neu-text-color)">Traditional Variants</h3>
					<div class="space-y-3">
						<Button variant="default">Default</Button>
						<Button variant="outline">Outline</Button>
						<Button variant="secondary">Secondary</Button>
						<Button variant="ghost">Ghost</Button>
					</div>
				</div>

				<!-- Mixed Usage -->
				<div class="neu-card-sm">
					<h3 class="text-lg font-semibold mb-4" style="color: var(--neu-text-color)">Mixed Usage</h3>
					<div class="flex flex-wrap gap-2">
						<Button variant="neumorphic-primary" size="sm">Save</Button>
						<Button variant="neumorphic" size="sm">Cancel</Button>
						<Button variant="neumorphic-danger" size="sm">Delete</Button>
					</div>
				</div>
			</div>
		</div>

		<!-- Card Components -->
		<div class="neu-card mb-12">
			<h2 class="text-3xl font-bold mb-6" style="color: var(--neu-text-color)">Card Components</h2>
			
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<div class="neu-card-sm">
					<h3 class="text-lg font-semibold mb-2" style="color: var(--neu-text-color)">Small Card</h3>
					<p style="color: var(--neu-text-secondary)">This is a small neumorphic card with subtle shadows.</p>
				</div>

				<div class="neu-card">
					<h3 class="text-lg font-semibold mb-2" style="color: var(--neu-text-color)">Regular Card</h3>
					<p style="color: var(--neu-text-secondary)">This is a regular neumorphic card with medium shadows and padding.</p>
					<Button variant="neumorphic-primary" size="sm" class="mt-4">Action</Button>
				</div>

				<div class="neu-card-lg">
					<h3 class="text-lg font-semibold mb-2" style="color: var(--neu-text-color)">Large Card</h3>
					<p style="color: var(--neu-text-secondary)">This is a large neumorphic card with prominent shadows and generous padding.</p>
					<div class="flex gap-2 mt-4">
						<Button variant="neumorphic-success" size="sm">Confirm</Button>
						<Button variant="neumorphic" size="sm">Cancel</Button>
					</div>
				</div>
			</div>
		</div>

		<!-- Input Components -->
		<div class="neu-card mb-12">
			<h2 class="text-3xl font-bold mb-6" style="color: var(--neu-text-color)">Input Components</h2>
			
			<div class="grid gap-6 md:grid-cols-2">
				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium mb-2" style="color: var(--neu-text-color)">Neumorphic Input</label>
						<input 
							type="text" 
							placeholder="Enter text..."
							class="neu-input w-full neu-focus"
						/>
					</div>

					<div>
						<label class="block text-sm font-medium mb-2" style="color: var(--neu-text-color)">Neumorphic Textarea</label>
						<textarea 
							placeholder="Enter message..."
							rows="4"
							class="neu-input w-full neu-focus resize-none"
						></textarea>
					</div>
				</div>

				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium mb-2" style="color: var(--neu-text-color)">Neumorphic Select</label>
						<select class="neu-input w-full neu-focus">
							<option>Choose option...</option>
							<option>Option 1</option>
							<option>Option 2</option>
							<option>Option 3</option>
						</select>
					</div>

					<div class="flex items-center space-x-4">
						<label class="flex items-center space-x-2 cursor-pointer">
							<input type="checkbox" class="neu-input w-5 h-5" />
							<span style="color: var(--neu-text-color)">Checkbox</span>
						</label>
						<label class="flex items-center space-x-2 cursor-pointer">
							<input type="radio" name="radio" class="neu-input w-5 h-5" />
							<span style="color: var(--neu-text-color)">Radio</span>
						</label>
					</div>
				</div>
			</div>
		</div>

		<!-- Code Examples -->
		<div class="neu-card mb-12">
			<h2 class="text-3xl font-bold mb-6" style="color: var(--neu-text-color)">Usage Examples</h2>
			
			<div class="grid gap-6 lg:grid-cols-2">
				<!-- Component Usage -->
				<div class="neu-card-sm">
					<h3 class="text-lg font-semibold mb-4" style="color: var(--neu-text-color)">Component Usage</h3>
					<div class="space-y-4">
						<div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
							<h4 class="font-semibold mb-2" style="color: var(--neu-text-color)">Basic Button:</h4>
							<code class="text-sm" style="color: var(--neu-text-secondary)">&lt;Button variant="neumorphic"&gt;Click Me&lt;/Button&gt;</code>
						</div>
						<div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
							<h4 class="font-semibold mb-2" style="color: var(--neu-text-color)">Primary Button:</h4>
							<code class="text-sm" style="color: var(--neu-text-secondary)">&lt;Button variant="neumorphic-primary" size="lg"&gt;Primary&lt;/Button&gt;</code>
						</div>
						<div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
							<h4 class="font-semibold mb-2" style="color: var(--neu-text-color)">Custom Classes:</h4>
							<code class="text-sm" style="color: var(--neu-text-secondary)">&lt;div class="neu-card"&gt;Content&lt;/div&gt;</code>
						</div>
					</div>
				</div>

				<!-- Theming Usage -->
				<div class="neu-card-sm">
					<h3 class="text-lg font-semibold mb-4" style="color: var(--neu-text-color)">Theming (like ui-neumorphism)</h3>
					<div class="space-y-4">
						<div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
							<h4 class="font-semibold mb-2" style="color: var(--neu-text-color)">Override Variables:</h4>
							<code class="text-sm" style="color: var(--neu-text-secondary)">overrideThemeVariables(&#123; '--neu-primary': '#ff6b6b' &#125;);</code>
						</div>
						<div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
							<h4 class="font-semibold mb-2" style="color: var(--neu-text-color)">Apply Preset:</h4>
							<code class="text-sm" style="color: var(--neu-text-secondary)">applyThemePreset('dark');</code>
						</div>
						<div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
							<h4 class="font-semibold mb-2" style="color: var(--neu-text-color)">Custom Theme:</h4>
							<code class="text-sm" style="color: var(--neu-text-secondary)">createCustomTheme('#4299e1', &#123; isDark: false &#125;);</code>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div class="text-center neu-card">
			<h2 class="text-2xl font-bold mb-4" style="color: var(--neu-text-color)">PickNWin Neumorphic Design System</h2>
			<p class="mb-6" style="color: var(--neu-text-secondary)">A comprehensive neumorphic design system for Svelte, inspired by ui-neumorphism's theming approach but built specifically for our PickNWin application.</p>
			<div class="flex flex-wrap justify-center gap-4">
				<Button variant="neumorphic-primary" on:click={() => window.location.href = '/'}>
					🏠 Back to Home
				</Button>
				<Button variant="neumorphic" on:click={() => window.location.href = '/button-demo'}>
					🎨 Button Demo
				</Button>
			</div>
		</div>
	</div>
</div>

<style>
	/* Additional custom styles for the demo */
	:global(.neu-card),
	:global(.neu-card-sm),
	:global(.neu-card-lg) {
		transition: var(--neu-transition-normal);
	}

	:global(.neu-card):hover,
	:global(.neu-card-sm):hover,
	:global(.neu-card-lg):hover {
		transform: translateY(-2px);
		box-shadow: var(--neu-shadow-xl);
	}

	/* Code block styling */
	code {
		font-family: 'Fira Code', 'Consolas', monospace;
		font-size: 0.875rem;
		line-height: 1.4;
	}

	/* Input focus improvements */
	:global(.neu-input:focus) {
		transform: none;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>