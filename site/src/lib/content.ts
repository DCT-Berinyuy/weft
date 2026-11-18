const repo = 'https://github.com/ken-morel/weft';

export const site = {
	name: 'weft',
	tagline: 'Reproducible deployments for tiny Linux hosts',
	description:
		'Weft is a deployment and task orchestration tool for Linux written in Zig. One static binary is the CLI client, the remote daemon, and the task supervisor.',
	repo,
	readme: `${repo}#readme`,
	license: `${repo}/blob/dev/LICENSE`,
	changelog: `${repo}/blob/dev/CHANGELOG.md`,
	releases: `${repo}/releases/tag/nightly`,
	maintainer: { name: 'Engon Ken Morel', url: 'https://github.com/ken-morel' },
	zigVersion: '0.18.0'
} as const;

export const badges = [
	{ label: 'license', value: 'MIT', color: '#3a7bd5', href: site.license },
	{ label: 'zig', value: `${site.zigVersion}+`, color: '#f7a41d', href: 'https://ziglang.org' },
	{ label: 'platform', value: 'linux x86_64', color: '#555', href: site.releases },
	{ label: 'release', value: 'nightly', color: '#159957', href: site.releases }
] as const;

export const highlights = [
	{
		title: 'No container runtime',
		body: 'Tasks run under a built-in supervisor using Linux namespaces and cgroups v2, so there is no Docker daemon or image registry to feed.'
	},
	{
		title: 'Nix packages without Nix',
		body: 'Pipelines pull packages straight from cache.nixos.org and unpack them into a shared store. The target needs neither NixOS nor a Nix daemon.'
	},
	{
		title: 'Runs where others cannot',
		body: 'Isolation adapts to the kernel: full VMs, LXC, OpenVZ, and Google Colab each get a matching profile.'
	},
	{
		title: 'Reach hosts without a public IP',
		body: 'Connect over TCP, through a stdio proxy command, or via an address-provider script such as a port forwarder.'
	},
	{
		title: 'Authenticated and encrypted',
		body: 'Clients sign in with Ed25519 keys, and each session is encrypted with XChaCha20-Poly1305 after an X25519 key exchange.'
	},
	{
		title: 'Resumable deployments',
		body: 'Artifacts move between remotes automatically, and a failed deployment resumes from the step where it stopped.'
	}
] as const;

export const commands = [
	{ cmd: 'weft remote install <host> [profile]', desc: 'copy weft to a host over SSH, install the daemon, and authorize your key' },
	{ cmd: 'weft remote register <host> [pubkey]', desc: 'authorize another client key on a remote' },
	{ cmd: 'weft remote monitor [remote]', desc: 'stream live CPU, memory, disk, network, and task usage' },
	{ cmd: 'weft do [mode:][remote.]pipeline ...', desc: 'resolve the dependency graph and run pipelines across remotes' },
	{ cmd: 'weft resume [deployment]', desc: 'retry the failed or interrupted steps of a deployment' },
	{ cmd: 'weft env [mode:]name[,name...] [-- cmd]', desc: 'open a shell or run a command with a pipeline environment' },
	{ cmd: 'weft task spawn|kill|logs <target>', desc: 'run, stop, or follow a single pipeline step' },
	{ cmd: 'weft artifact pull|push|register|path', desc: 'move or locate deployment artifacts' },
	{ cmd: 'weft cache pull|push|path', desc: 'sync persistent workspace caches between remotes' },
	{ cmd: 'weft nix search|query|info', desc: 'find Nix packages and inspect store paths' },
	{ cmd: 'weft daemon install|run|register', desc: 'manage the daemon on the current host' },
	{ cmd: 'weft check', desc: 'validate weft/weft.zon' },
	{ cmd: 'weft key', desc: 'print this client’s public key' },
	{ cmd: 'weft version', desc: 'print the build version and wire protocol hash' }
] as const;

export const isolationProfiles = [
	{ name: 'kvm', use: 'VMs and bare metal (default)', detail: 'mount, PID, network namespaces, pivot_root, cgroups v2' },
	{ name: 'lxc', use: 'LXC containers', detail: 'namespaces without nested cgroups' },
	{ name: 'vz', use: 'OpenVZ / Virtuozzo', detail: 'unprivileged mode, no mount or unshare' },
	{ name: 'colab', use: 'Notebooks and locked-down containers', detail: 'same unprivileged mode as vz' }
] as const;

export const scaleProfiles = [
	{ name: 'tiny', workers: 1, compression: 'off' },
	{ name: 'small', workers: 4, compression: 'decompress only (default)' },
	{ name: 'large', workers: 16, compression: 'both directions' }
] as const;

export const snippets = {
	binary: `curl -fsSL "${repo}/releases/download/nightly/weft-linux-x86_64.tar.gz" | sudo tar -xz -C /usr/local/bin
sudo chmod +x /usr/local/bin/weft`,
	action: `- uses: ken-morel/weft@nightly
  with:
    version: nightly`,
	source: `git clone ${repo}.git
cd weft
zig build -Doptimize=ReleaseSafe`,
	remote: `weft remote install root@203.0.113.10 kvm-small`,
	config: `.{
    .workspace = "shop",
    .modes = .{ "default", "prod" },
    .environments = .{
        .{ .name = "zig", .pkgs = .{"<hash>-zig-0.18.0"} },
    },
    .remotes = .{
        .{ "vps", "203.0.113.10:9338", "prod" },
    },
    .pipelines = .{
        .{ .name = "build", .in = .{"-"}, .on = .{"local"}, .env = .{ .uses = .{"zig"} } },
        .{ .name = "server", .in = .{"build"}, .sibling = .{ .then = .kill } },
    },
}`,
	run: `weft check
weft do prod:vps.server`
} as const;
