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

	// 🔹 Buscar animais do banco
	async function fetchAnimais() {
		try {
			const res = await fetch('/api/animais');
			if (res.ok) {
				animais = await res.json();
			} else {
				errorMsg = 'Erro ao buscar animais.';
			}
		} catch (err) {
			errorMsg = 'Erro na conexão com o servidor.';
		}
	}

	// 🔹 Adicionar ou editar um animal
	async function salvarAnimal() {
    try {
        const url = '/api/animais';
        const method = editMode ? 'PUT' : 'POST';
        const body = JSON.stringify(
            editMode
                ? { id: editId, ...form } // Se estiver editando, envia o id existente
                : { id: crypto.randomUUID(), ...form } // Se for um novo, gera um ID
        );

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body
        });

        if (res.ok) {
            fetchAnimais(); // Atualiza a lista
            resetForm();
        } else {
            errorMsg = `Erro ao ${editMode ? 'atualizar' : 'adicionar'} animal.`;
        }
    } catch (err) {
        errorMsg = 'Erro na conexão com o servidor.';
    }
}


	// 🔹 Preencher formulário para edição
	/**
	 * @param {{ nome: any; tipo: any; quantidade: any; galpao: any; ativo: any; id: any; }} animal
	 */
	function editarAnimal(animal) {
		form = { nome: animal.nome, tipo: animal.tipo, quantidade: animal.quantidade, galpao: animal.galpao, ativo: animal.ativo };
		editMode = true;
		editId = animal.id;
	}

	// 🔹 Excluir animal
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

			if (res.ok) {
				fetchAnimais();
			} else {
				errorMsg = 'Erro ao excluir animal.';
			}
		} catch (err) {
			errorMsg = 'Erro na conexão com o servidor.';
		}
	}

	// 🔹 Resetar formulário
	function resetForm() {
		form = { nome: '', tipo: '', quantidade: 0, galpao: '', ativo: true };
		editMode = false;
		editId = null;
	}

	// 🔹 Buscar os dados ao carregar a página
	onMount(fetchAnimais);
</script>

<main>
	<h1>Gestão de Animais</h1>

	{#if errorMsg}
		<p class="error">{errorMsg}</p>
	{/if}

	<!-- 🔹 Formulário de Cadastro -->
	<section>
		<h2>{editMode ? 'Editar' : 'Adicionar'} Animal</h2>
		<form on:submit|preventDefault={salvarAnimal}>
			<label>Nome: <input type="text" bind:value={form.nome} required /></label>
			<label>Tipo: <input type="text" bind:value={form.tipo} required /></label>
			<label>Quantidade: <input type="number" bind:value={form.quantidade} min="0" required /></label>
			<label>Galpão: <input type="text" bind:value={form.galpao} required /></label>
			<label>
				Ativo:
				<input type="checkbox" bind:checked={form.ativo} />
			</label>
			<button type="submit">{editMode ? 'Atualizar' : 'Adicionar'}</button>
			{#if editMode}
				<button type="button" on:click={resetForm} class="cancel">Cancelar</button>
			{/if}
		</form>
	</section>

	<!-- 🔹 Lista de Animais -->
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
				{#each animais as animal}
					<tr>
						<td>{animal.nome}</td>
						<td>{animal.tipo}</td>
						<td>{animal.quantidade}</td>
						<td>{animal.galpao}</td>
						<td>{animal.ativo ? '✅' : '❌'}</td>
						<td>
							<button on:click={() => editarAnimal(animal)}>✏️ Editar</button>
							<button on:click={() => excluirAnimal(animal.id)}>🗑️ Excluir</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>

	<HomeButton text="Voltar para Home 🏠" to="/" />
</main>

<style>
	.error {
		color: red;
		margin-bottom: 10px;
	}

	form {
		display: flex;
		flex-direction: column;
		max-width: 400px;
		gap: 10px;
		margin-bottom: 20px;
	}

	button {
		background: #41644A;
		color: white;
		border: none;
		padding: 10px;
		cursor: pointer;
	}

	button:hover {
		background: #2f4a32;
	}

	.cancel {
		background: #a94442;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 20px;
	}

	th, td {
		border: 1px solid #ddd;
		padding: 8px;
		text-align: center;
	}

	th {
		background-color: #f4f4f4;
	}
</style>
