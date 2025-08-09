<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import HomeButton from '$lib/components/HomeButton.svelte';

	/**
	 * @type {any[]}
	 */
	let transacoes = [];

	let tipo = 'receita';
	let descricao = '';
	let valor = '';
	let data = ''; // opcional (yyyy-mm-dd)

	/**
	 * @type {null}
	 */
	let editando = null;
	let erro = '';

	$: currentUserId = $page?.data?.user?.id ?? '';

	async function fetchTransacoes() {
		const res = await fetch('/api/financeiro');
		transacoes = await res.json();
	}

	function validar() {
		if (!currentUserId) return 'Sessão expirada. Faça login novamente.';
		if (!tipo) return 'Tipo é obrigatório';
		if (!descricao.trim()) return 'Descrição é obrigatória';
		if (valor === '' || isNaN(Number(valor))) return 'Valor inválido';
		return '';
	}

	async function salvarTransacao() {
		erro = validar();
		if (erro) return;

		const payload = {
			tipo,
			descricao,
			valor: Number(valor),
			criadoPor: currentUserId,
			...(data ? { data } : {})
		};

		const method = editando ? 'PUT' : 'POST';
		const body = editando ? { id: editando, ...payload } : payload;

		const res = await fetch('/api/financeiro', {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});

		if (!res.ok) {
			const j = await res.json().catch(() => ({}));
			erro = j?.message || 'Falha ao salvar transação';
			return;
		}

		resetForm();
		await fetchTransacoes();
	}

	/**
	 * @param {any} id
	 */
	async function deletarTransacao(id) {
		const res = await fetch('/api/financeiro', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});

		if (!res.ok) {
			const j = await res.json().catch(() => ({}));
			erro = j?.message || 'Falha ao excluir transação';
			return;
		}

		await fetchTransacoes();
	}

	/**
	 * @param {{ tipo: string; descricao: string; valor: any; data: string; id: any; }} t
	 */
	function carregarParaEdicao(t) {
		tipo = t.tipo;
		descricao = t.descricao;
		valor = String(t.valor);
		data = t.data ? t.data.slice(0, 10) : '';
		editando = t.id;
		erro = '';
	}

	function resetForm() {
		tipo = 'receita';
		descricao = '';
		valor = '';
		data = '';
		editando = null;
		erro = '';
	}

	/**
	 * @param {any} x
	 */
	function brl(x) {
		const n = Number(x);
		if (Number.isNaN(n)) return x ?? '-';
		return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
	}

	onMount(fetchTransacoes);
</script>

<main>
	<h1>Financeiro</h1>

	{#if erro}
		<p class="erro">{erro}</p>
	{/if}

	<form on:submit|preventDefault={salvarTransacao}>
		<div class="grid">
			<label>
				Tipo
				<select bind:value={tipo} required>
					<option value="receita">Receita</option>
					<option value="despesa">Despesa</option>
				</select>
			</label>

			<label>
				Descrição
				<input type="text" bind:value={descricao} required />
			</label>

			<label>
				Valor (R$)
				<input type="number" min="0" step="0.01" bind:value={valor} required />
			</label>

			<label>
				Data (opcional)
				<input type="date" bind:value={data} />
			</label>
		</div>

		<div class="acoes">
			<button type="submit">{editando ? 'Atualizar' : 'Adicionar'}</button>
			{#if editando}
				<button type="button" class="sec" on:click={resetForm}>Cancelar</button>
			{/if}
		</div>
	</form>

	<table>
		<thead>
			<tr>
				<th>Tipo</th>
				<th>Descrição</th>
				<th>Valor</th>
				<th>Data</th>
				<th>Ações</th>
			</tr>
		</thead>
		<tbody>
			{#each transacoes as t}
				<tr>
					<td>{t.tipo}</td>
					<td>{t.descricao}</td>
					<td>{brl(t.valor)}</td>
					<td>{t.data ? new Date(t.data).toLocaleDateString() : '-'}</td>
					<td class="acoes-cell">
						<button on:click={() => carregarParaEdicao(t)}>Editar</button>
						<button class="danger" on:click={() => deletarTransacao(t.id)}>Excluir</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<HomeButton text="Voltar" to="/home" />
</main>
  
  <style>
    main {
      max-width: 980px;
      margin: auto;
      padding: 20px;
    }
  
    h1 {
      margin-bottom: 16px;
    }
  
    .erro {
      background: #ffe3e3;
      color: #8a1f1f;
      border: 1px solid #f5c2c2;
      padding: 10px;
      border-radius: 6px;
      margin-bottom: 12px;
    }
  
    form {
      border: 1px solid #e5e5e5;
      padding: 16px;
      border-radius: 8px;
      background: #fafafa;
      margin-bottom: 20px;
    }
  
    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }
  
    @media (min-width: 720px) {
      .grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  
    label {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 14px;
    }
  
    input, select {
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #ddd;
      background: white;
    }
  
    .acoes {
      margin-top: 12px;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
  
    button {
      cursor: pointer;
      padding: 10px 14px;
      border: none;
      border-radius: 6px;
      background: #41644A;
      color: #fff;
      transition: 0.2s;
    }
  
    button:hover { opacity: 0.9; }
  
    .sec {
      background: #88918c;
    }
  
    .danger {
      background: #b43c3c;
    }
  
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 14px;
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
  
    .acoes-cell {
      display: flex;
      gap: 6px;
    }
  </style>
  