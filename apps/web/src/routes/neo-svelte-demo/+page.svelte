<script lang="ts">
	import {
		NeoThemeProvider,
		NeoButton,
		NeoCard,
		NeoInput,
		NeoSwitch,
		NeoRange,
		NeoBadge,
		NeoProgress,
		NeoCheckbox,
		NeoRadio
	} from '@dvcol/neo-svelte';

	let inputValue = '';
	let switchValue = false;
	let rangeValue = 50;
	let checkboxValue = false;
	let radioValue = 'option1';
</script>

<svelte:head>
	<title>Neo Svelte Demo - Neumorphic UI Library</title>
	<meta name="description" content="Demo of @dvcol/neo-svelte neumorphic UI components" />
</svelte:head>

<NeoThemeProvider>
	<div class="min-h-screen p-8" style="background-color: var(--neo-background-color);">
		<div class="max-w-6xl mx-auto">
			<h1 class="text-4xl font-bold text-center mb-8" style="color: var(--neo-text-color);">
				Neo Svelte Demo
			</h1>
			<p class="text-center mb-12" style="color: var(--neo-text-color-secondary);">
				Exploring the @dvcol/neo-svelte neumorphic UI library for Svelte 5
			</p>

			<!-- Buttons Section -->
			<NeoCard class="mb-8 p-6">
				<h2 class="text-2xl font-semibold mb-4" style="color: var(--neo-text-color);">Buttons</h2>
				<div class="flex flex-wrap gap-4">
					<NeoButton>Default Button</NeoButton>
					<NeoButton variant="primary">Primary Button</NeoButton>
					<NeoButton variant="secondary">Secondary Button</NeoButton>
					<NeoButton disabled>Disabled Button</NeoButton>
				</div>
			</NeoCard>

			<!-- Inputs Section -->
			<NeoCard class="mb-8 p-6">
				<h2 class="text-2xl font-semibold mb-4" style="color: var(--neo-text-color);">Inputs</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium mb-2" style="color: var(--neo-text-color);">
							Text Input
						</label>
						<NeoInput bind:value={inputValue} placeholder="Enter text..." />
					</div>
					<div>
						<label class="block text-sm font-medium mb-2" style="color: var(--neo-text-color);">
							Password Input
						</label>
						<NeoInput type="password" placeholder="Enter password..." />
					</div>
				</div>
			</NeoCard>

			<!-- Form Controls Section -->
			<NeoCard class="mb-8 p-6">
				<h2 class="text-2xl font-semibold mb-4" style="color: var(--neo-text-color);">Form Controls</h2>
				<div class="space-y-6">
					<!-- Switch -->
					<div class="flex items-center space-x-4">
						<NeoSwitch bind:checked={switchValue} />
						<span style="color: var(--neo-text-color);">Toggle Switch: {switchValue ? 'On' : 'Off'}</span>
					</div>

					<!-- Range Slider -->
					<div>
						<label class="block text-sm font-medium mb-2" style="color: var(--neo-text-color);">
							Range Slider: {rangeValue}
						</label>
						<NeoRange bind:value={rangeValue} min={0} max={100} />
					</div>

					<!-- Checkbox -->
					<div class="flex items-center space-x-4">
						<NeoCheckbox bind:checked={checkboxValue} />
						<span style="color: var(--neo-text-color);">Checkbox: {checkboxValue ? 'Checked' : 'Unchecked'}</span>
					</div>

					<!-- Radio Buttons -->
					<div>
						<label class="block text-sm font-medium mb-2" style="color: var(--neo-text-color);">
							Radio Group: {radioValue}
						</label>
						<div class="flex space-x-4">
							<div class="flex items-center space-x-2">
								<NeoRadio bind:group={radioValue} value="option1" />
								<span style="color: var(--neo-text-color);">Option 1</span>
							</div>
							<div class="flex items-center space-x-2">
								<NeoRadio bind:group={radioValue} value="option2" />
								<span style="color: var(--neo-text-color);">Option 2</span>
							</div>
							<div class="flex items-center space-x-2">
								<NeoRadio bind:group={radioValue} value="option3" />
								<span style="color: var(--neo-text-color);">Option 3</span>
							</div>
						</div>
					</div>
				</div>
			</NeoCard>

			<!-- Progress and Badges Section -->
			<NeoCard class="mb-8 p-6">
				<h2 class="text-2xl font-semibold mb-4" style="color: var(--neo-text-color);">Progress & Badges</h2>
				<div class="space-y-6">
					<!-- Progress Bar -->
					<div>
						<label class="block text-sm font-medium mb-2" style="color: var(--neo-text-color);">
							Progress: {rangeValue}%
						</label>
						<NeoProgress value={rangeValue} max={100} />
					</div>

					<!-- Badges -->
					<div>
						<label class="block text-sm font-medium mb-2" style="color: var(--neo-text-color);">Badges</label>
						<div class="flex flex-wrap gap-2">
							<NeoBadge>Default</NeoBadge>
							<NeoBadge variant="primary">Primary</NeoBadge>
							<NeoBadge variant="secondary">Secondary</NeoBadge>
							<NeoBadge variant="success">Success</NeoBadge>
							<NeoBadge variant="warning">Warning</NeoBadge>
							<NeoBadge variant="error">Error</NeoBadge>
						</div>
					</div>
				</div>
			</NeoCard>

			<!-- Comparison Section -->
			<NeoCard class="mb-8 p-6">
				<h2 class="text-2xl font-semibold mb-4" style="color: var(--neo-text-color);">Library Comparison</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<h3 class="text-lg font-medium mb-3" style="color: var(--neo-text-color);">@dvcol/neo-svelte</h3>
						<ul class="space-y-2 text-sm" style="color: var(--neo-text-color-secondary);">
							<li>✅ Native Svelte 5 support</li>
							<li>✅ Pre-built neumorphic components</li>
							<li>✅ Theme provider system</li>
							<li>✅ Comprehensive component library</li>
							<li>✅ Accessible components</li>
							<li>✅ TypeScript support</li>
						</ul>
					</div>
					<div>
						<h3 class="text-lg font-medium mb-3" style="color: var(--neo-text-color);">Our Custom Implementation</h3>
						<ul class="space-y-2 text-sm" style="color: var(--neo-text-color-secondary);">
							<li>✅ Custom CSS variables system</li>
							<li>✅ Tailwind integration</li>
							<li>✅ Light/dark mode support</li>
							<li>✅ Dynamic theme overrides</li>
							<li>⚠️ Limited component set</li>
							<li>⚠️ Manual maintenance required</li>
						</ul>
					</div>
				</div>
			</NeoCard>

			<!-- Navigation -->
			<div class="text-center">
				<NeoButton onclick={() => window.history.back()}>← Back to Home</NeoButton>
				<a href="/neumorphic-demo" class="ml-4">
					<NeoButton variant="secondary">View Custom Implementation</NeoButton>
				</a>
			</div>
		</div>
	</div>
</NeoThemeProvider>

<style>
	/* Additional custom styles if needed */
	:global(body) {
		background-color: #f3f4f6;
	}
</style>