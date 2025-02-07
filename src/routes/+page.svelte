<script>
  import { onMount } from 'svelte';

  /**
	 * @type {any[]}
	 */
  let ovos = [];

  // Use onMount para rodar fetch somente no cliente
  onMount(async () => {
    const response = await fetch('/api/ovos');
    ovos = await response.json();
    console.log(ovos);
  });
</script>

<h1>Dashboard do Sistema</h1>
<p>Bem-vindo ao sistema de gerenciamento de ovos e animais!</p>

<ul>
  {#each ovos as ovo}
    <li>{ovo.tipoAnimal}: {ovo.guardados} guardados</li>
  {/each}
</ul>
