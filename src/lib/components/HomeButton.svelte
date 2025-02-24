<script>
    import { goto } from '$app/navigation';

    // 🔹 Definição de props para tornar o botão reutilizável
    export let text = 'Clique Aqui';  // Texto do botão
    export let to = '/';  // URL de destino
</script>

<button on:click={() => goto(to)}>
    {text}
</button>

<style>
    button {
        background: #41644A;
        color: #f1f0e9;
        text-align: center;
        height: 100px ;
        width: 200px;
        margin: 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 24px;
        transition: background 0.3s ease;
    }

    button:hover {
        background: #2f4a32;
    }
</style>
