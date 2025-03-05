<script>
	import { onMount } from 'svelte';
	import HomeButton from '$lib/components/HomeButton.svelte';

	/**
	 * @type {any[]}
	 */
	let lotes = [];
	/**
	 * @type {any[]}
	 */
	let movimentacoes = [];
	let newLote = { animalId: '', quantidade: '', dataColeta: '' };
	let newMovimentacao = { loteId: '', tipo: '', quantidade: '', destino: '', responsavelId: '' };
	let errorMsg = '';

	// 🔹 Função para buscar os lotes de ovos da API
	async function fetchLotes() {
		try {
			const res = await fetch('/api/ovos');
			if (res.ok) {
				lotes = await res.json();
			} else {
				errorMsg = 'Erro ao buscar lotes de ovos.';
			}
		} catch (err) {
			errorMsg = 'Erro na conexão com o servidor.';
		}
	}

	// 🔹 Função para buscar movimentações de ovos da API
	async function fetchMovimentacoes() {
		try {
			const res = await fetch('/api/movimentacao-ovo');
			if (res.ok) {
				movimentacoes = await res.json();
			} else {
				errorMsg = 'Erro ao buscar movimentações.';
			}
		} catch (err) {
			errorMsg = 'Erro na conexão com o servidor.';
		}
	}

	// 🔹 Adicionar um novo lote de ovos
	async function addLote() {
		try {
			const res = await fetch('/api/ovos', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newLote)
			});

			if (res.ok) {
				await fetchLotes();
				newLote = { animalId: '', quantidade: '', dataColeta: '' };
			} else {
				errorMsg = 'Erro ao adicionar lote.';
			}
		} catch (err) {
			errorMsg = 'Erro na conexão com o servidor.';
		}
	}

	// 🔹 Adicionar uma movimentação de ovos
	async function addMovimentacao() {
		try {
			const res = await fetch('/api/movimentacao-ovo', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newMovimentacao)
			});

			if (res.ok) {
				await fetchMovimentacoes();
				newMovimentacao = { loteId: '', tipo: '', quantidade: '', destino: '', responsavelId: '' };
			} else {
				errorMsg = 'Erro ao adicionar movimentação.';
			}
		} catch (err) {
			errorMsg = 'Erro na conexão com o servidor.';
		}
	}

	// 🔹 Deletar um lote de ovos
	/**
	 * @param {any} id
	 */
	async function deleteLote(id) {
		try {
			const res = await fetch('/api/ovos', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id })
			});

			if (res.ok) {
				await fetchLotes();
			} else {
				errorMsg = 'Erro ao remover lote.';
			}
		} catch (err) {
			errorMsg = 'Erro na conexão com o servidor.';
		}
	}

	// 🔹 Deletar uma movimentação de ovos
	/**
	 * @param {any} id
	 */
	async function deleteMovimentacao(id) {
		try {
			const res = await fetch('/api/movimentacao-ovo', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id })
			});

			if (res.ok) {
				await fetchMovimentacoes();
			} else {
				errorMsg = 'Erro ao remover movimentação.';
			}
		} catch (err) {
			errorMsg = 'Erro na conexão com o servidor.';
		}
	}

	// 🔹 Buscar os dados ao carregar a página
	onMount(() => {
		fetchLotes();
		fetchMovimentacoes();
	});
</script>

<main>
	<h1>Gestão de Ovos</h1>

	{#if errorMsg}
		<p class="error">{errorMsg}</p>
	{/if}

	<!-- 🔹 Formulário para adicionar um novo lote -->
	<section class="form-section">
		<h2>Adicionar Lote de Ovos</h2>
		<form on:submit|preventDefault={addLote}>
			<input type="text" placeholder="ID do Animal" bind:value={newLote.animalId} required />
			<input type="number" placeholder="Quantidade" bind:value={newLote.quantidade} required />
			<input type="date" bind:value={newLote.dataColeta} required />
			<button type="submit">Adicionar Lote</button>
		</form>
	</section>

	<!-- 🔹 Tabela de Lotes -->
	<section>
		<h2>Lotes de Ovos</h2>
		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>Animal</th>
					<th>Quantidade</th>
					<th>Data Coleta</th>
					<th>Ações</th>
				</tr>
			</thead>
			<tbody>
				{#each lotes as lote}
					<tr>
						<td>{lote.id}</td>
						<td>{lote.animalId}</td>
						<td>{lote.quantidade}</td>
						<td>{lote.dataColeta}</td>
						<td><button on:click={() => deleteLote(lote.id)}>❌</button></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>

	<!-- 🔹 Formulário para movimentações -->
	<section class="form-section">
		<h2>Registrar Movimentação</h2>
		<form on:submit|preventDefault={addMovimentacao}>
			<input type="text" placeholder="ID do Lote" bind:value={newMovimentacao.loteId} required />
			<input
				type="text"
				placeholder="Tipo (guardado, vendido...)"
				bind:value={newMovimentacao.tipo}
				required
			/>
			<input
				type="number"
				placeholder="Quantidade"
				bind:value={newMovimentacao.quantidade}
				required
			/>
			<input type="text" placeholder="Destino (opcional)" bind:value={newMovimentacao.destino} />
			<input
				type="text"
				placeholder="Responsável"
				bind:value={newMovimentacao.responsavelId}
				required
			/>
			<button type="submit">Registrar Movimentação</button>
		</form>
	</section>

	<!-- 🔹 Tabela de Movimentações -->
	<section>
		<h2>Movimentações</h2>
		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>Lote</th>
					<th>Tipo</th>
					<th>Quantidade</th>
					<th>Destino</th>
					<th>Responsável</th>
					<th>Ações</th>
				</tr>
			</thead>
			<tbody>
				{#each movimentacoes as movimentacao}
					<tr>
						<td>{movimentacao.id}</td>
						<td>{movimentacao.loteId}</td>
						<td>{movimentacao.tipo}</td>
						<td>{movimentacao.quantidade}</td>
						<td>{movimentacao.destino || '-'}</td>
						<td>{movimentacao.responsavelId}</td>
						<td><button on:click={() => deleteMovimentacao(movimentacao.id)}>❌</button></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>

	<HomeButton text="Ir para Estoques 📦" to="ovos/estoque"/>
</main>

<style>
	.error {
		color: red;
	}
	table {
		width: 100%;
		border-collapse: collapse;
	}
	th,
	td {
		border: 1px solid #ddd;
		padding: 8px;
	}
</style>
