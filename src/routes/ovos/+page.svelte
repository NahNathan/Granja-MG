<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import HomeButton from '$lib/components/HomeButton.svelte';

	/**
	 * @type {any[]}
	 */
	let coletas = [];
	/**
	 * @type {any[]}
	 */
	let animais = [];
	let errorMsg = '';
	let form = { animalId: '', quantidade: '', dataColeta: '', observacao: '' };

	const mapaAnimalNome = () =>
		Object.fromEntries(animais.map((a) => [a.id, `${a.nome} (${a.tipo})`]));

	async function fetchColetas() {
		try {
			const res = await fetch('/api/ovos');
			if (!res.ok) throw new Error();
			coletas = await res.json();
		} catch {
			errorMsg = 'Erro ao buscar coletas de ovos.';
		}
	}

	async function fetchAnimais() {
		try {
			const res = await fetch('/api/animais');
			if (!res.ok) throw new Error();
			animais = await res.json();
		} catch {
			errorMsg = 'Erro ao buscar animais.';
		}
	}

	async function adicionarColeta() {
		try {
			const payload = {
				animalId: form.animalId,
				quantidade: Number(form.quantidade),
				dataColeta: form.dataColeta,
				observacao: form.observacao?.trim() || null
			};
			const res = await fetch('/api/ovos', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
			if (!res.ok) throw new Error();
			await fetchColetas();
			form = { animalId: '', quantidade: '', dataColeta: '', observacao: '' };
			errorMsg = '';
		} catch {
			errorMsg = 'Erro ao adicionar coleta.';
		}
	}

	/**
	 * @param {any} id
	 */
	async function excluirColeta(id) {
		try {
			const res = await fetch('/api/ovos', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id })
			});
			if (!res.ok) throw new Error();
			await fetchColetas();
		} catch {
			errorMsg = 'Erro ao remover coleta.';
		}
	}

	/**
	 * @param {string | number | Date} d
	 */
	function fmtData(d) {
		try {
			return new Date(d).toLocaleDateString();
		} catch {
			return d;
		}
	}

	onMount(async () => {
		await Promise.all([fetchAnimais(), fetchColetas()]);
	});
</script>

<main>
	<header class="topbar">
		<h1>Coletas de Ovos</h1>
		<HomeButton text="Estoque 📦" to="/ovos/estoque" />
	</header>

	{#if errorMsg}
		<p class="error">{errorMsg}</p>
	{/if}

	<section class="form-section">
		<h2>Registrar Coleta</h2>
		<form on:submit|preventDefault={adicionarColeta}>
			<label>Animal
				<select bind:value={form.animalId} required>
					<option value="" disabled selected>Selecione</option>
					{#each animais as a}
						<option value={a.id}>{a.nome} ({a.tipo})</option>
					{/each}
				</select>
			</label>

			<label>Quantidade
				<input type="number" min="0" bind:value={form.quantidade} required />
			</label>

			<label>Data da Coleta
				<input type="date" bind:value={form.dataColeta} required />
			</label>

			<label>Observação
				<input type="text" bind:value={form.observacao} placeholder="Opcional" />
			</label>

			<button type="submit">Adicionar</button>
		</form>
	</section>

	<section>
		<h2>Lista de Coletas</h2>
		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>Animal</th>
					<th>Quantidade</th>
					<th>Data</th>
					<th>Observação</th>
					<th>Ações</th>
				</tr>
			</thead>
			<tbody>
				{#each coletas as c}
					<tr>
						<td>{c.id}</td>
						<td>{mapaAnimalNome()[c.animalId] ?? c.animalId}</td>
						<td>{c.quantidade}</td>
						<td>{fmtData(c.dataColeta)}</td>
						<td>{c.observacao || '-'}</td>
						<td>
							<button on:click={() => excluirColeta(c.id)}>❌</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>
</main>


<style>
	main {
		max-width: 980px;
		margin: 0 auto;
		padding: 20px;
	}

	.topbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}

	h1 { margin: 0; }

	.form-section form {
		margin-top: 12px;
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;
		border: 1px solid #e5e5e5;
		padding: 16px;
		border-radius: 8px;
		background: #fafafa;
	}

	@media (min-width: 720px) {
		.form-section form { grid-template-columns: repeat(2, 1fr); }
		.form-section form button { grid-column: span 2; }
	}

	label { display: flex; flex-direction: column; gap: 6px; }

	input {
		padding: 10px;
		border-radius: 6px;
		border: 1px solid #ddd;
		background: #fff;
	}

	button {
		cursor: pointer;
		padding: 10px 14px;
		border: none;
		border-radius: 6px;
		background: #41644A;
		color: #fff;
		transition: .2s;
	}

	button:hover { opacity: .9; }

	table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 16px;
	}

	thead th {
		background: #41644A;
		color: #fff;
		text-align: left;
		padding: 10px;
	}

	tbody td {
		border: 1px solid #eee;
		padding: 10px;
		vertical-align: middle;
	}

	.error {
		background: #ffe3e3;
		color: #8a1f1f;
		border: 1px solid #f5c2c2;
		padding: 10px;
		border-radius: 6px;
		margin: 12px 0;
	}
</style>
