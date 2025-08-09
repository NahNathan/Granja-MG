<script>
	import { onMount } from 'svelte';
	import HomeButton from '$lib/components/HomeButton.svelte';
  
	/**
	 * @type {any[]}
	 */
	let animais = [];
	let errorMsg = '';
	let form = { nome: '', tipo: '', quantidade: 0, galpao: '', ativo: true };
	let editMode = false;
	/**
	 * @type {null}
	 */
	let editId = null;
  
	async function fetchAnimais() {
	  try {
		const res = await fetch('/api/animais');
		if (!res.ok) throw new Error();
		animais = await res.json();
	  } catch {
		errorMsg = 'Erro ao buscar animais.';
	  }
	}
  
	function validar() {
	  if (!form.nome.trim()) return 'Nome é obrigatório';
	  if (!form.tipo.trim()) return 'Tipo é obrigatório';
	  if (form.quantidade == null || Number(form.quantidade) < 0) return 'Quantidade inválida';
	  if (!form.galpao.trim()) return 'Galpão é obrigatório';
	  return '';
	}
  
	async function salvarAnimal() {
	  errorMsg = validar();
	  if (errorMsg) return;
  
	  const method = editMode ? 'PUT' : 'POST';
	  const payload = editMode
		? { id: editId, ...form, quantidade: Number(form.quantidade) }
		: { id: crypto.randomUUID(), ...form, quantidade: Number(form.quantidade) };
  
	  try {
		const res = await fetch('/api/animais', {
		  method,
		  headers: { 'Content-Type': 'application/json' },
		  body: JSON.stringify(payload)
		});
		if (!res.ok) throw new Error();
		await fetchAnimais();
		resetForm();
	  } catch {
		errorMsg = `Erro ao ${editMode ? 'atualizar' : 'adicionar'} animal.`;
	  }
	}
  
	/**
	 * @param {{ nome: any; tipo: any; quantidade: any; galpao: any; ativo: any; id: any; }} a
	 */
	function editarAnimal(a) {
	  form = {
		nome: a.nome,
		tipo: a.tipo,
		quantidade: a.quantidade,
		galpao: a.galpao,
		ativo: !!a.ativo
	  };
	  editMode = true;
	  editId = a.id;
	  errorMsg = '';
	}
  
	/**
	 * @param {any} id
	 */
	async function excluirAnimal(id) {
	  try {
		const res = await fetch('/api/animais', {
		  method: 'DELETE',
		  headers: { 'Content-Type': 'application/json' },
		  body: JSON.stringify({ id })
		});
		if (!res.ok) throw new Error();
		await fetchAnimais();
	  } catch {
		errorMsg = 'Erro ao excluir animal.';
	  }
	}
  
	function resetForm() {
	  form = { nome: '', tipo: '', quantidade: 0, galpao: '', ativo: true };
	  editMode = false;
	  editId = null;
	}
  
	onMount(fetchAnimais);
  </script>
  
  <main>
	<h1>Gestão de Animais</h1>
  
	<section>
	  <h2>Lista de Animais</h2>
	  <table>
		<thead>
		  <tr>
			<th>Nome</th>
			<th>Tipo</th>
			<th>Quantidade</th>
			<th>Galpão</th>
			<th>Ativo</th>
			<th>Ações</th>
		  </tr>
		</thead>
		<tbody>
		  {#each animais as a}
			<tr>
			  <td>{a.nome}</td>
			  <td>{a.tipo}</td>
			  <td>{a.quantidade}</td>
			  <td>{a.galpao}</td>
			  <td>{a.ativo ? '✅' : '❌'}</td>
			  <td>
				<button on:click={() => editarAnimal(a)}>✏️ Editar</button>
				<button on:click={() => excluirAnimal(a.id)}>🗑️ Excluir</button>
			  </td>
			</tr>
		  {/each}
		</tbody>
	  </table>
	</section>
  
	{#if errorMsg}
	  <p class="error">{errorMsg}</p>
	{/if}
  
	<section>
	  <h2>{editMode ? 'Editar' : 'Adicionar'} Animal</h2>
	  <form on:submit|preventDefault={salvarAnimal}>
		<label>Nome
		  <input type="text" bind:value={form.nome} required />
		</label>
  
		<label>Tipo
		  <input type="text" bind:value={form.tipo} required />
		</label>
  
		<label>Quantidade
		  <input type="number" min="0" bind:value={form.quantidade} required />
		</label>
  
		<label>Galpão
		  <input type="text" bind:value={form.galpao} required />
		</label>
  
		<label class="checkbox">
		  <input type="checkbox" bind:checked={form.ativo} />
		  Ativo
		</label>
  
		<div class="acoes">
		  <button type="submit">{editMode ? 'Atualizar' : 'Adicionar'}</button>
		  {#if editMode}
			<button type="button" class="sec" on:click={resetForm}>Cancelar</button>
		  {/if}
		</div>
	  </form>
	</section>
  
	<HomeButton text="Voltar para Home 🏠" to="/home" />
  </main>
  
  <style>
	main {
	  max-width: 980px;
	  margin: auto;
	  padding: 20px;
	}
  
	h1 { margin-bottom: 16px; }
  
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
	  vertical-align: middle;
	}
  
	form {
	  margin-top: 20px;
	  display: grid;
	  grid-template-columns: 1fr;
	  gap: 12px;
	  border: 1px solid #e5e5e5;
	  padding: 16px;
	  border-radius: 8px;
	  background: #fafafa;
	}
  
	@media (min-width: 720px) {
	  form { grid-template-columns: repeat(2, 1fr); }
	  .checkbox { grid-column: span 2; }
	  .acoes { grid-column: span 2; }
	}
  
	label { display: flex; flex-direction: column; gap: 6px; }
  
	input[type="text"], input[type="number"] {
	  padding: 10px;
	  border-radius: 6px;
	  border: 1px solid #ddd;
	  background: #fff;
	}
  
	.checkbox {
	  display: flex;
	  align-items: center;
	  gap: 8px;
	}
  
	.acoes {
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
	  transition: .2s;
	}
  
	button:hover { opacity: .9; }
  
	.sec { background: #88918c; }
  
	.error {
	  background: #ffe3e3;
	  color: #8a1f1f;
	  border: 1px solid #f5c2c2;
	  padding: 10px;
	  border-radius: 6px;
	  margin-top: 12px;
	}
  </style>
  