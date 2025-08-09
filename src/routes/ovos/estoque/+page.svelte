<script>
	import { onMount } from 'svelte';
	import HomeButton from '$lib/components/HomeButton.svelte';

	/**
	 * @type {any[]}
	 */
	let coletas = [];
	let errorMsg = '';

	async function fetchColetas() {
		try {
			const res = await fetch('/api/ovos');
			if (!res.ok) throw new Error();
			coletas = await res.json();
		} catch {
			errorMsg = 'Erro ao buscar coletas.';
		}
	}

	// Total geral coletado
	$: totalGeral = coletas.reduce((acc, c) => acc + Number(c.quantidade || 0), 0);

	// Total por animal (mapa {animalId: total})
	$: totalPorAnimal = coletas.reduce((map, c) => {
		const k = c.animalId || '—';
		map[k] = (map[k] || 0) + Number(c.quantidade || 0);
		return map;
	}, /** @type {Record<string, number>} */ ({}));

	// Total por dia (yyyy-mm-dd -> total)
	/**
	 * @param {string | number | Date} d
	 */
	function toYMD(d) {
		const dt = new Date(d);
		const y = dt.getFullYear();
		const m = String(dt.getMonth() + 1).padStart(2, '0');
		const day = String(dt.getDate()).padStart(2, '0');
		return `${y}-${m}-${day}`;
	}
	$: totalPorDia = coletas.reduce((map, c) => {
		const k = c.dataColeta ? toYMD(c.dataColeta) : '—';
		map[k] = (map[k] || 0) + Number(c.quantidade || 0);
		return map;
	}, /** @type {Record<string, number>} */ ({}));

	onMount(fetchColetas);
</script>

<main>
	<header class="topbar">
		<h1>Estoque / Resumo de Coletas</h1>
		<HomeButton text="Voltar" to="/ovos" />
	</header>

	{#if errorMsg}
		<p class="error">{errorMsg}</p>
	{/if}

	<section class="cards">
		<div class="card">
			<h3>Total Geral</h3>
			<p class="big">{totalGeral}</p>
		</div>
		<div class="card">
			<h3>Animais distintos</h3>
			<p class="big">{Object.keys(totalPorAnimal).length}</p>
		</div>
		<div class="card">
			<h3>Dias com coleta</h3>
			<p class="big">{Object.keys(totalPorDia).length}</p>
		</div>
	</section>

	<section>
		<h2>Total por Animal</h2>
		<table>
			<thead>
				<tr>
					<th>Animal (ID)</th>
					<th>Total Coletado</th>
				</tr>
			</thead>
			<tbody>
				{#each Object.entries(totalPorAnimal) as [animalId, total]}
					<tr>
						<td>{animalId}</td>
						<td>{total}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>

	<section>
		<h2>Total por Dia</h2>
		<table>
			<thead>
				<tr>
					<th>Data</th>
					<th>Total Coletado</th>
				</tr>
			</thead>
			<tbody>
				{#each Object.entries(totalPorDia) as [dia, total]}
					<tr>
						<td>{dia}</td>
						<td>{total}</td>
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

	.cards {
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;
		margin: 16px 0 24px;
	}

	@media (min-width: 720px) {
		.cards { grid-template-columns: repeat(3, 1fr); }
	}

	.card {
		border: 1px solid #e5e5e5;
		border-radius: 8px;
		background: #fafafa;
		padding: 14px;
	}

	.card .big {
		font-size: 24px;
		font-weight: 700;
		margin-top: 6px;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 12px;
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
