<script>
    import { onMount } from "svelte";
    import HomeButton from "$lib/components/HomeButton.svelte";

    /**
	 * @type {any[]}
	 */
    let vendas = [];
    let descricao = "";
    let comprador = "";
    let quantidade = "";
    let valorTotal = "";
    let metodoPagamento = "dinheiro";
    let responsavelId = "";
    /**
	 * @type {null}
	 */
    let editando = null;

    async function fetchVendas() {
        const res = await fetch("/api/vendas");
        vendas = await res.json();
    }

    async function salvarVenda() {
        const body = JSON.stringify({
            descricao,
            comprador,
            quantidade: parseInt(quantidade),
            valorTotal: parseFloat(valorTotal),
            metodoPagamento,
            responsavelId
        });

        const method = editando ? "PUT" : "POST";
        await fetch("/api/vendas", {
            method,
            headers: { "Content-Type": "application/json" },
            body: editando ? JSON.stringify({ id: editando, ...JSON.parse(body) }) : body
        });

        resetForm();
        fetchVendas();
    }

    /**
	 * @param {any} id
	 */
    async function deletarVenda(id) {
        await fetch("/api/vendas", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });
        fetchVendas();
    }

    /**
	 * @param {{ descricao: string; comprador: string; quantidade: string; valorTotal: string; metodoPagamento: string; responsavelId: string; id: any; }} venda
	 */
    function carregarParaEdicao(venda) {
        descricao = venda.descricao;
        comprador = venda.comprador;
        quantidade = venda.quantidade;
        valorTotal = venda.valorTotal;
        metodoPagamento = venda.metodoPagamento;
        responsavelId = venda.responsavelId;
        editando = venda.id;
    }

    function resetForm() {
        descricao = "";
        comprador = "";
        quantidade = "";
        valorTotal = "";
        metodoPagamento = "dinheiro";
        responsavelId = "";
        editando = null;
    }

    onMount(fetchVendas);
</script>

<main>
    <h1>Vendas</h1>

    <form on:submit|preventDefault={salvarVenda}>
        <input type="text" placeholder="Descrição" bind:value={descricao} required />
        <input type="text" placeholder="Comprador" bind:value={comprador} required />
        <input type="number" placeholder="Quantidade" bind:value={quantidade} required />
        <input type="number" placeholder="Valor Total" bind:value={valorTotal} required />
        
        <select bind:value={metodoPagamento}>
            <option value="dinheiro">Dinheiro</option>
            <option value="cartão">Cartão</option>
            <option value="pix">Pix</option>
        </select>

        <input type="text" placeholder="ID do Responsável" bind:value={responsavelId} required />

        <button type="submit">{editando ? "Atualizar" : "Adicionar"}</button>
        {#if editando}
            <button type="button" on:click={resetForm}>Cancelar</button>
        {/if}
    </form>

    <table>
        <thead>
            <tr>
                <th>Descrição</th>
                <th>Comprador</th>
                <th>Quantidade</th>
                <th>Valor</th>
                <th>Método</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            {#each vendas as venda}
                <tr>
                    <td>{venda.descricao}</td>
                    <td>{venda.comprador}</td>
                    <td>{venda.quantidade}</td>
                    <td>R$ {venda.valorTotal}</td>
                    <td>{venda.metodoPagamento}</td>
                    <td>
                        <button on:click={() => carregarParaEdicao(venda)}>Editar</button>
                        <button on:click={() => deletarVenda(venda.id)}>Excluir</button>
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
