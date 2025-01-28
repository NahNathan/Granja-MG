<script>
  /**
	 * @type {any[]}
	 */
  let ovos = [];

  // Busca os dados do endpoint
  async function carregarOvos() {
    const response = await fetch('/api/ovos');
    ovos = await response.json();
    console.log(ovos)
  }

  carregarOvos();
</script>

<h1>Dashboard do Sistema</h1>
<p>Bem-vindo ao sistema de gerenciamento de ovos e animais!</p>

