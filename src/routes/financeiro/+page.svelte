<script>
    import { onMount } from "svelte";
    import HomeButton from "$lib/components/HomeButton.svelte";

    /**
	 * @type {any[]}
	 */
    let transacoes = [];
    let tipo = "receita";
    let descricao = "";
    let valor = "";
    let categoria = "";
    let criadoPor = "";
    /**
	 * @type {null}
	 */
    let editando = null;

    async function fetchTransacoes() {
        const res = await fetch("/api/financeiro");
        transacoes = await res.json();
    }

    async function salvarTransacao() {
        const body = JSON.stringify({
            tipo,
            descricao,
            valor: parseFloat(valor),
            categoria,
            criadoPor
        });

        const method = editando ? "PUT" : "POST";
        await fetch("/api/financeiro", {
            method,
            headers: { "Content-Type": "application/json" },
            body: editando ? JSON.stringify({ id: editando, ...JSON.parse(body) }) : body
        });

        resetForm();
        fetchTransacoes();
    }

    /**
	 * @param {any} id
	 */
    async function deletarTransacao(id) {
        await fetch("/api/financeiro", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });
        fetchTransacoes();
    }

    /**
	 * @param {{ tipo: string; descricao: string; valor: string; categoria: string; criadoPor: string; id: any; }} transacao
	 */
    function carregarParaEdicao(transacao) {
        tipo = transacao.tipo;
        descricao = transacao.descricao;
        valor = transacao.valor;
        categoria = transacao.categoria;
        criadoPor = transacao.criadoPor;
        editando = transacao.id;
    }

    function resetForm() {
        tipo = "receita";
        descricao = "";
        valor = "";
        categoria = "";
        criadoPor = "";
        editando = null;
    }

    onMount(fetchTransacoes);
</script>

<main>
    <h1>Financeiro</h1>

    <form on:submit|preventDefault={salvarTransacao}>
        <select bind:value={tipo}>
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
        </select>
        
        <input type="text" placeholder="Descrição" bind:value={descricao} required />
        <input type="number" placeholder="Valor" bind:value={valor} required />
        <input type="text" placeholder="Categoria" bind:value={categoria} />
        <input type="text" placeholder="ID do Responsável" bind:value={criadoPor} required />

        <button type="submit">{editando ? "Atualizar" : "Adicionar"}</button>
        {#if editando}
            <button type="button" on:click={resetForm}>Cancelar</button>
        {/if}
    </form>

    <table>
        <thead>
            <tr>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Categoria</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            {#each transacoes as transacao}
                <tr>
                    <td>{transacao.tipo}</td>
                    <td>{transacao.descricao}</td>
                    <td>R$ {transacao.valor}</td>
                    <td>{transacao.categoria || "N/A"}</td>
                    <td>
                        <button on:click={() => carregarParaEdicao(transacao)}>Editar</button>
                        <button on:click={() => deletarTransacao(transacao.id)}>Excluir</button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>

    <HomeButton text="Voltar" to="/home" />
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

    form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 20px;
    }

    button {
        cursor: pointer;
        padding: 10px;
        border: none;
        border-radius: 5px;
        transition: 0.3s;
    }

    button:hover {
        opacity: 0.8;
    }
</style>

