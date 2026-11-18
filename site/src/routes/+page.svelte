<script lang="ts">
	import Terminal from '#lib/components/Terminal.svelte';
	import {
		badges,
		commands,
		highlights,
		isolationProfiles,
		scaleProfiles,
		site,
		snippets
	} from '#lib';
</script>

<a id="skip-to-content" href="#content">Skip to the content.</a>

<header class="page-header">
	<h1 class="project-name">{site.name}</h1>
	<p class="project-tagline">{site.tagline}</p>
	<a href={site.repo} class="btn">View on GitHub</a>
	<a href={site.releases} class="btn">Download nightly</a>
	<a href={site.readme} class="btn">Read the docs</a>
</header>

<main id="content" class="main-content">
	<ul class="badges" aria-label="Project facts">
		{#each badges as b (b.label)}
			<li>
				<a href={b.href}
					><span class="k">{b.label}</span><span class="v" style:background={b.color}>{b.value}</span
					></a
				>
			</li>
		{/each}
	</ul>

	<Terminal />

	<hr />

	<p>
		<strong>weft</strong> runs multi-stage deployments across one or more Linux hosts, from a laptop
		to a $0.30 VPS, an unprivileged container, or a Colab notebook. Describe your pipelines once in
		<code>weft/weft.zon</code>, and weft builds them in order, moves artifacts between machines, and
		keeps services running.
	</p>
	<p>
		It is a <strong>single static binary</strong> with <strong>no external dependencies</strong>:
		the same file is the CLI, the remote daemon, and the task supervisor.
	</p>

	<hr />

	<h2 class="sr-only">Highlights</h2>
	<ul class="highlights">
		{#each highlights as h (h.title)}
			<li><strong>{h.title}.</strong> {h.body}</li>
		{/each}
	</ul>

	<hr />

	<h1 id="try-it">Try it!</h1>

	<h3>GitHub Actions</h3>
	<p>Add weft to any workflow on an Ubuntu runner:</p>
	<pre><code>{snippets.action}</code></pre>

	<h1 id="installation">Installation</h1>
	<p>weft runs on Linux x86_64. The daemon also needs root on the hosts it deploys to.</p>

	<h3>Prebuilt binary</h3>
	<pre><code>{snippets.binary}</code></pre>

	<h3>From source</h3>
	<p>Requires Zig <code>{site.zigVersion}</code> or newer. The binary is written to <code>zig-out/bin/weft</code>.</p>
	<pre><code>{snippets.source}</code></pre>

	<h1 id="quick-start">Quick start</h1>

	<h3>1. Set up a remote</h3>
	<p>
		Copy weft to a server over SSH, start the daemon, and authorize your client key in one step:
	</p>
	<pre><code>{snippets.remote}</code></pre>

	<h3>2. Describe your pipelines</h3>
	<p>
		Create <code>weft/weft.zon</code> in your project. Each pipeline runs <code>weft/&lt;name&gt;.sh</code>
		by default. Find package identifiers with <code>weft nix query zig</code>.
	</p>
	<pre><code>{snippets.config}</code></pre>

	<h3>3. Deploy</h3>
	<pre><code>{snippets.run}</code></pre>
	<p>
		weft builds on your machine, uploads the artifact to the VPS, and replaces the running server.
		If anything fails, run <code>weft resume</code>.
	</p>

	<hr />

	<p>Click sections to expand.</p>

	<details>
		<summary><h1>Command-line reference</h1></summary>
		<p>
			Arguments can be positional or named (<code>-&lt;field&gt; &lt;value&gt;</code>). When output
			is piped, live views switch to plain, append-only logs.
		</p>
		<table>
			<thead><tr><th>Command</th><th>What it does</th></tr></thead>
			<tbody>
				{#each commands as c (c.cmd)}
					<tr><td><code>{c.cmd}</code></td><td>{c.desc}</td></tr>
				{/each}
			</tbody>
		</table>
		<p>See the <a href={site.readme}>README</a> for every option.</p>
	</details>

	<details>
		<summary><h1>Daemon profiles</h1></summary>
		<p>
			Pick a profile when installing, as <code>isolate-scale</code> with an optional port, for example
			<code>lxc-tiny</code> or <code>kvm-large-9338</code>.
		</p>
		<h3>Isolation</h3>
		<table>
			<thead><tr><th>Profile</th><th>For</th><th>Uses</th></tr></thead>
			<tbody>
				{#each isolationProfiles as p (p.name)}
					<tr><td><code>{p.name}</code></td><td>{p.use}</td><td>{p.detail}</td></tr>
				{/each}
			</tbody>
		</table>
		<h3>Scale</h3>
		<table>
			<thead><tr><th>Profile</th><th>Workers</th><th>Transfer compression</th></tr></thead>
			<tbody>
				{#each scaleProfiles as p (p.name)}
					<tr><td><code>{p.name}</code></td><td>{p.workers}</td><td>{p.compression}</td></tr>
				{/each}
			</tbody>
		</table>
	</details>

	<details>
		<summary><h1>Development</h1></summary>
		<p>
			weft is written in <a href="https://ziglang.org">Zig</a> and needs version
			<code>{site.zigVersion}</code> or newer.
		</p>
		<pre><code>zig build
zig build test</code></pre>
		<ul>
			<li>Read the <a href="{site.repo}/blob/dev/STYLE_GUIDE.md">style guide</a> before opening a pull request.</li>
			<li>Changes are tracked in the <a href={site.changelog}>changelog</a>.</li>
			<li>Use <code>weft decode</code> to inspect zoto-encoded task specs and wire packets.</li>
		</ul>
	</details>

	<footer class="site-footer">
		<span class="site-footer-owner"
			><a href={site.repo}>weft</a> is maintained by
			<a href={site.maintainer.url}>{site.maintainer.name}</a> and contributors.</span
		>
		<span class="site-footer-credits"
			>Released under the <a href={site.license}>MIT license</a>. Design inspired by
			<a href="https://eza.rocks">eza.rocks</a>.</span
		>
	</footer>
</main>

<style>
	.badges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin: 0 0 1.25rem;
		padding: 0;
		list-style: none;
	}

	.badges li {
		margin: 0;
	}

	.badges a {
		display: inline-flex;
		overflow: hidden;
		font: 0.72rem/1 Verdana, 'DejaVu Sans', sans-serif;
		color: #fff;
		border-radius: 3px;
	}

	.badges a:hover {
		text-decoration: none;
		filter: brightness(1.1);
	}

	.badges span {
		padding: 0.3rem 0.45rem;
	}

	.badges .k {
		background: #555;
	}

	.highlights {
		padding-left: 1.2rem;
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
