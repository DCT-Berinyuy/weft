<script lang="ts">
	type Tone = 'prompt' | 'cyan' | 'magenta' | 'yellow' | 'green' | 'dim' | 'plain';
	type Segment = { text: string; tone: Tone };
	type Line = { segments: Segment[]; delay: number };

	const seg = (text: string, tone: Tone = 'plain'): Segment => ({ text, tone });
	const log = (task: string, tone: Tone, text: string, delay = 250): Line => ({
		segments: [seg(task, tone), seg(' │ ', 'dim'), seg(text)],
		delay
	});

	const script: Line[] = [
		{ segments: [seg('$ ', 'prompt'), seg('weft do prod:vps.server')], delay: 900 },
		{ segments: [seg('{', 'cyan'), seg(' prod:local.build')], delay: 500 },
		log('prod:local.build', 'cyan', 'zig build -Doptimize=ReleaseSafe', 700),
		log('prod:local.build', 'cyan', 'Build Summary: 4/4 steps succeeded', 1100),
		{ segments: [seg('}', 'green'), seg(' prod:local.build (8412ms, CPU: 7930ms)')], delay: 400 },
		{ segments: [seg('>', 'yellow'), seg(' build@vps(compressed)')], delay: 1200 },
		{ segments: [seg('{', 'magenta'), seg(' prod:vps.server')], delay: 500 },
		log('prod:vps.server', 'magenta', 'starting shop server', 500),
		log('prod:vps.server', 'magenta', 'listening on 0.0.0.0:8080', 900)
	];

	let shown = $state(0);
	let reduceMotion = $state(false);

	$effect(() => {
		const media = window.matchMedia('(prefers-reduced-motion: reduce)');
		reduceMotion = media.matches;
		if (reduceMotion) {
			shown = script.length;
			return;
		}

		let timer: ReturnType<typeof setTimeout>;
		const step = (index: number) => {
			if (index >= script.length) {
				timer = setTimeout(() => {
					shown = 0;
					step(0);
				}, 4000);
				return;
			}
			timer = setTimeout(() => {
				shown = index + 1;
				step(index + 1);
			}, script[index].delay);
		};
		step(0);
		return () => clearTimeout(timer);
	});
</script>

<figure class="terminal" aria-label="Demo: weft builds locally, ships the artifact to a VPS, and restarts the server">
	<div class="bar" aria-hidden="true">
		<span></span><span></span><span></span>
		<p>~/shop</p>
	</div>
	<pre aria-hidden="true"><code
			>{#each script.slice(0, shown) as line, i (i)}{#each line.segments as s, j (j)}<span
						class={s.tone}>{s.text}</span
					>{/each}{'\n'}{/each}{#if !reduceMotion}<span class="cursor">▋</span>{/if}</code
		></pre>
	<figcaption class="sr-only">
		Running weft do prod:vps.server builds the project locally, uploads the build artifact to the VPS,
		replaces the running server, and streams its logs.
	</figcaption>
</figure>

<style>
	.terminal {
		margin: 0 0 1.5rem;
		overflow: hidden;
		background: #1d2327;
		border-radius: 0.4rem;
		box-shadow: 0 6px 24px rgba(21, 87, 153, 0.18);
	}

	.bar {
		display: flex;
		gap: 0.4rem;
		align-items: center;
		padding: 0.55rem 0.8rem;
		background: #2a3136;
	}

	.bar span {
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 50%;
		background: #4c565c;
	}

	.bar p {
		margin: 0 auto;
		padding-right: 2.5rem;
		font: 0.8rem var(--mono);
		color: #9aa5ab;
	}

	pre {
		min-height: 15.5rem;
		margin: 0 !important;
		padding: 1rem 1.1rem !important;
		color: #d8dee2 !important;
		background: transparent !important;
		border: 0 !important;
		border-radius: 0 !important;
	}

	code {
		padding: 0 !important;
		color: inherit !important;
		background: transparent !important;
	}

	.prompt {
		color: #6fcf97;
	}
	.cyan {
		color: #56c8d8;
	}
	.magenta {
		color: #d18ad8;
	}
	.yellow {
		color: #f2c94c;
	}
	.green {
		color: #6fcf97;
	}
	.dim {
		color: #6b777d;
	}

	.cursor {
		color: #9aa5ab;
		animation: blink 1s steps(1) infinite;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}
</style>
