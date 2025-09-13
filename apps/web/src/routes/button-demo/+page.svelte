<script lang="ts">
	import { Button } from '$lib/components/ui';
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
	<div class="max-w-4xl mx-auto">
		<h1 class="text-4xl font-bold text-gray-800 mb-8 text-center">Button Style Demo</h1>
		
		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
			<!-- Neumorphic Button -->
			<div class="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg">
				<h3 class="text-lg font-semibold text-gray-700 mb-4">Neumorphic Style</h3>
				<div class="space-y-4">
					<Button variant="neumorphic">Click Me</Button>
					<Button variant="neumorphic" disabled>Disabled</Button>
					<Button variant="neumorphic" size="sm">Small</Button>
					<Button variant="neumorphic" size="lg">Large</Button>
				</div>
			</div>
			
			<!-- Neumorphic Primary -->
			<div class="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg">
				<h3 class="text-lg font-semibold text-gray-700 mb-4">Neumorphic Primary</h3>
				<div class="space-y-4">
					<Button variant="neumorphic-primary">Primary</Button>
					<Button variant="neumorphic-primary" disabled>Disabled</Button>
					<Button variant="neumorphic-primary" size="sm">Small</Button>
					<Button variant="neumorphic-primary" size="lg">Large</Button>
				</div>
			</div>
			
			<!-- Neumorphic Success -->
			<div class="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg">
				<h3 class="text-lg font-semibold text-gray-700 mb-4">Neumorphic Success</h3>
				<div class="space-y-4">
					<Button variant="neumorphic-success">Success</Button>
					<Button variant="neumorphic-success" disabled>Disabled</Button>
					<Button variant="neumorphic-success" size="sm">Small</Button>
					<Button variant="neumorphic-success" size="lg">Large</Button>
				</div>
			</div>
			
			<!-- Neumorphic Warning -->
			<div class="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg">
				<h3 class="text-lg font-semibold text-gray-700 mb-4">Neumorphic Warning</h3>
				<div class="space-y-4">
					<Button variant="neumorphic-warning">Warning</Button>
					<Button variant="neumorphic-warning" disabled>Disabled</Button>
					<Button variant="neumorphic-warning" size="sm">Small</Button>
					<Button variant="neumorphic-warning" size="lg">Large</Button>
				</div>
			</div>
			
			<!-- Neumorphic Danger -->
			<div class="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg">
				<h3 class="text-lg font-semibold text-gray-700 mb-4">Neumorphic Danger</h3>
				<div class="space-y-4">
					<Button variant="neumorphic-danger">Danger</Button>
					<Button variant="neumorphic-danger" disabled>Disabled</Button>
					<Button variant="neumorphic-danger" size="sm">Small</Button>
					<Button variant="neumorphic-danger" size="lg">Large</Button>
				</div>
			</div>
			
			<!-- Default Button -->
			<div class="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg">
				<h3 class="text-lg font-semibold text-gray-700 mb-4">Default Style</h3>
				<div class="space-y-4">
					<Button variant="default">Click Me</Button>
					<Button variant="default" disabled>Disabled</Button>
					<Button variant="default" size="sm">Small</Button>
					<Button variant="default" size="lg">Large</Button>
				</div>
			</div>
			
			<!-- Outline Button -->
			<div class="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg">
				<h3 class="text-lg font-semibold text-gray-700 mb-4">Outline Style</h3>
				<div class="space-y-4">
					<Button variant="outline">Click Me</Button>
					<Button variant="outline" disabled>Disabled</Button>
					<Button variant="outline" size="sm">Small</Button>
					<Button variant="outline" size="lg">Large</Button>
				</div>
			</div>
			
			<!-- Secondary Button -->
			<div class="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg">
				<h3 class="text-lg font-semibold text-gray-700 mb-4">Secondary Style</h3>
				<div class="space-y-4">
					<Button variant="secondary">Click Me</Button>
					<Button variant="secondary" disabled>Disabled</Button>
					<Button variant="secondary" size="sm">Small</Button>
					<Button variant="secondary" size="lg">Large</Button>
				</div>
			</div>
			
			<!-- Ghost Button -->
			<div class="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg">
				<h3 class="text-lg font-semibold text-gray-700 mb-4">Ghost Style</h3>
				<div class="space-y-4">
					<Button variant="ghost">Click Me</Button>
					<Button variant="ghost" disabled>Disabled</Button>
					<Button variant="ghost" size="sm">Small</Button>
					<Button variant="ghost" size="lg">Large</Button>
				</div>
			</div>
			
			<!-- Destructive Button -->
			<div class="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg">
				<h3 class="text-lg font-semibold text-gray-700 mb-4">Destructive Style</h3>
				<div class="space-y-4">
					<Button variant="destructive">Delete</Button>
					<Button variant="destructive" disabled>Disabled</Button>
					<Button variant="destructive" size="sm">Small</Button>
					<Button variant="destructive" size="lg">Large</Button>
				</div>
			</div>
		</div>
		
		<!-- Usage Examples -->
		<div class="mt-12 bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200/50 shadow-lg">
			<h2 class="text-2xl font-bold text-gray-800 mb-6">Usage Examples</h2>
			<div class="space-y-4">
				<div class="bg-gray-100 p-4 rounded-lg">
					<h4 class="font-semibold text-gray-700 mb-2">Basic Neumorphic:</h4>
					<code class="text-sm text-gray-600">&lt;Button variant="neumorphic"&gt;Click Me&lt;/Button&gt;</code>
				</div>
				<div class="bg-gray-100 p-4 rounded-lg">
					<h4 class="font-semibold text-gray-700 mb-2">Primary Neumorphic:</h4>
					<code class="text-sm text-gray-600">&lt;Button variant="neumorphic-primary"&gt;Primary&lt;/Button&gt;</code>
				</div>
				<div class="bg-gray-100 p-4 rounded-lg">
					<h4 class="font-semibold text-gray-700 mb-2">Success Neumorphic:</h4>
					<code class="text-sm text-gray-600">&lt;Button variant="neumorphic-success" size="lg"&gt;Success&lt;/Button&gt;</code>
				</div>
				<div class="bg-gray-100 p-4 rounded-lg">
					<h4 class="font-semibold text-gray-700 mb-2">Warning Neumorphic:</h4>
					<code class="text-sm text-gray-600">&lt;Button variant="neumorphic-warning"&gt;Warning&lt;/Button&gt;</code>
				</div>
				<div class="bg-gray-100 p-4 rounded-lg">
					<h4 class="font-semibold text-gray-700 mb-2">Danger Neumorphic:</h4>
					<code class="text-sm text-gray-600">&lt;Button variant="neumorphic-danger"&gt;Danger&lt;/Button&gt;</code>
				</div>
				<div class="bg-gray-100 p-4 rounded-lg">
					<h4 class="font-semibold text-gray-700 mb-2">Extra Large Size:</h4>
					<code class="text-sm text-gray-600">&lt;Button variant="neumorphic-primary" size="xl"&gt;Extra Large&lt;/Button&gt;</code>
				</div>
			</div>
		</div>
	</div>
</div>