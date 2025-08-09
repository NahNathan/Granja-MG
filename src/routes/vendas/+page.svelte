<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import HomeButton from '$lib/components/HomeButton.svelte';

	/**
	 * @type {any[]}
	 */
	let vendas = [];
	/**
	 * @type {any[]}
	 */
	let animais = [];

	let animalId = '';
	let descricao = '';
	let comprador = '';
	let quantidade = '';
	let valorTotal = '';
	let metodoPagamento = 'dinheiro';
	let dataVenda = '';

	/**
	 * @type {null}
	 */
	let editando = null;
	let erro = '';

	$: currentUserId = $page?.data?.user?.id ?? '';

	const mapaAnimalNome = () =>
		Object.fromEntries(animais.map((a) => [a.id, `${a.nome} (${a.tipo})`]));

	async function fetchAnimais() {
		const res = await fetch('/api/animais');
		animais = await res.json();
	}

	async function fetchVendas() {
		const res = await fetch('/api/vendas');
		vendas = await res.json();
	}

	function validar() {
		if (!currentUserId) return 'Sessão expirada. Faça login novamente.';
		if (!animalId) return 'Selecione o animal';
		if (!descricao.trim()) return 'Descrição é obrigatória';
		if (!comprador.trim()) return 'Comprador é obrigatório';
		if (quantidade === '' || Number(quantidade) <= 0) return 'Quantidade inválida';
		if (valorTotal === '' || Number(valorTotal) < 0) return 'Valor total inválido';
		return '';
	}

	async function salvarVenda() {
		erro = validar();
		if (erro) return;

		const payload = {
			animalId,
			descricao,
			comprador,
			quantidade: Number(quantidade),
			valorTotal: Number(valorTotal),
			metodoPagamento,
			responsavelId: currentUserId,
			...(dataVenda ? { dataVenda } : {})
		};

		const method = editando ? 'PUT' : 'POST';
		const body = editando ? { id: editando, ...payload } : payload;

		const res = await fetch('/api/vendas', {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});

		if (!res.ok) {
			const j = await res.json().catch(() => ({}));
			erro = j?.message || 'Falha ao salvar venda';
			return;
		}

		resetForm();
		await fetchVendas();
	}

	/**
	 * @param {any} id
	 */
	async function deletarVenda(id) {
		const res = await fetch('/api/vendas', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});
		if (!res.ok) {
			const j = await res.json().catch(() => ({}));
			erro = j?.message || 'Falha ao excluir venda';
			return;
		}
		await fetchVendas();
	}

	/**
	 * @param {{ animalId: string; descricao: string; comprador: string; quantidade: any; valorTotal: any; metodoPagamento: string; dataVenda: string; id: any; }} v
	 */
	function carregarParaEdicao(v) {
		animalId = v.animalId;
		descricao = v.descricao;
		comprador = v.comprador;
		quantidade = String(v.quantidade);
		valorTotal = String(v.valorTotal);
		metodoPagamento = v.metodoPagamento;
		dataVenda = v.dataVenda ? v.dataVenda.slice(0, 10) : '';
		editando = v.id;
		erro = '';
	}

	function resetForm() {
		animalId = '';
		descricao = '';
		comprador = '';
		quantidade = '';
		valorTotal = '';
		metodoPagamento = 'dinheiro';
		dataVenda = '';
		editando = null;
		erro = '';
	}

	onMount(async () => {
		await Promise.all([fetchAnimais(), fetchVendas()]);
	});
</script>

<main>
	<h1>Vendas</h1>

	{#if erro}
		<p class="erro">{erro}</p>
	{/if}

	<form on:submit|preventDefault={salvarVenda}>
		<div class="grid">
			<label>
				Animal
				<select bind:value={animalId} required>
					<option value="" disabled selected>Selecione</option>
					{#each animais as a}
						<option value={a.id}>{a.nome} ({a.tipo})</option>
					{/each}
				</select>
			</label>

			<label>
				Descrição
				<input type="text" bind:value={descricao} required />
			</label>

			<label>
				Comprador
				<input type="text" bind:value={comprador} required />
			</label>

			<label>
				Quantidade
				<input type="number" min="1" step="1" bind:value={quantidade} required />
			</label>

			<label>
				Valor Total (R$)
				<input type="number" min="0" step="0.01" bind:value={valorTotal} required />
			</label>

			<label>
				Método de Pagamento
				<select bind:value={metodoPagamento}>
					<option value="dinheiro">Dinheiro</option>
					<option value="cartao">Cartão</option>
					<option value="pix">Pix</option>
				</select>
			</label>

			<label>
				Data da Venda (opcional)
				<input type="date" bind:value={dataVenda} />
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
				<th>Animal</th>
				<th>Descrição</th>
				<th>Comprador</th>
				<th>Quantidade</th>
				<th>Valor</th>
				<th>Método</th>
				<th>Data</th>
				<th>Ações</th>
			</tr>
		</thead>
		<tbody>
			{#each vendas as v}
				<tr>
					<td>{mapaAnimalNome()[v.animalId] ?? v.animalId}</td>
					<td>{v.descricao}</td>
					<td>{v.comprador}</td>
					<td>{v.quantidade}</td>
					<td>R$ {Number(v.valorTotal).toFixed(2)}</td>
					<td>{v.metodoPagamento}</td>
					<td>{v.dataVenda ? new Date(v.dataVenda).toLocaleDateString() : '-'}</td>
					<td class="acoes-cell">
						<button on:click={() => carregarParaEdicao(v)}>Editar</button>
						<button class="danger" on:click={() => deletarVenda(v.id)}>Excluir</button>
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
  