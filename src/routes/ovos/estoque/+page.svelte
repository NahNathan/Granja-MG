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
	let errorMsg = '';

	// 🔹 Buscar lotes de ovos
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

	// 🔹 Buscar movimentações de ovos
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

	// 🔹 Calcular o saldo atual de cada lote
	/**
	 * @param {any} loteId
	 */
	function calcularEstoque(loteId) {
		let saldo = 0;

		// Somar e subtrair movimentações relevantes ao lote
		movimentacoes.forEach(mov => {
			if (mov.loteId === loteId) {
				if (mov.tipo === 'guardado') saldo += mov.quantidade;
				else if (mov.tipo === 'vendido' || mov.tipo === 'descartado') saldo -= mov.quantidade;
			}
		});

		return saldo;
	}

	// 🔹 Buscar os dados ao carregar a página
	onMount(() => {
		fetchLotes();
		fetchMovimentacoes();
	});
</script>

<main>
	<h1>Estoque de Ovos</h1>

	{#if errorMsg}
		<p class="error">{errorMsg}</p>
	{/if}

	<!-- 🔹 Tabela de Estoque -->
	<section>
		<h2>Resumo do Estoque</h2>
		<table>
			<thead>
				<tr>
					<th>ID do Lote</th>
					<th>Animal</th>
					<th>Quantidade Inicial</th>
					<th>Saldo Atual</th>
					<th>Última Atualização</th>
				</tr>
			</thead>
			<tbody>
				{#each lotes as lote}
					<tr>
						<td>{lote.id}</td>
						<td>{lote.animalId}</td>
						<td>{lote.quantidade}</td>
						<td>{calcularEstoque(lote.id)}</td>
						<td>{lote.atualizadoEm}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>

	<HomeButton text="Voltar para Home 🏠" to="/home" />
</main>

<style>
    main {
        max-width: 800px;
        margin: auto;
        padding: 20px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
    }

    th, td {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: left;
    }

    th {
        background-color: #41644A;
        color: white;
    }
</style>

