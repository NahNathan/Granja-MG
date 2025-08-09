<script>
	import HomeButton from '$lib/components/HomeButton.svelte';
</script>

<main>
	<div class="left-section">
		<h2>Opções do Sistema</h2>
		<h2>ㅤ</h2>
		<HomeButton text="Ovos🥚" to="/ovos" />
		<HomeButton text="Financeiro💸" to="/financeiro" />
		<HomeButton text="Vendas💰" to="/vendas" />
		<HomeButton text="Animais🐔" to="/animais" />
	</div>

	<div class="right-section">
		<h2>Resumo</h2>
	</div>
</main>

<style>
	
	main {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 90vh;
	}

	.left-section, .right-section {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.left-section {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 15px;
		justify-items: center;
	}

	@media (max-width: 768px) {
		main {
			flex-direction: column;
		}

		.left-section {
			order: 1;
			grid-template-columns: 1fr; 
		}

		.right-section {
			order: 2;
		}
	}
</style>

