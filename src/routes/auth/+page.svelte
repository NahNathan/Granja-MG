<script>
    import { goto } from '$app/navigation';
    import HomeButton from '$lib/components/HomeButton.svelte';
  
    let username = '';
    let password = '';
    let errorMsg = '';
  
    async function login() {
      try {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
  
        if (response.ok) {
          goto('/home');  // Redireciona para o dashboard após o login
        } else {
          const result = await response.json();
          errorMsg = result.message || 'Falha no login.';
        }
      } catch (error) {
        errorMsg = 'Erro ao tentar conectar com o servidor.';
      }
    }
  </script>
  
  <h1>Login</h1>
  
  {#if errorMsg}
    <p style="color: red;">{errorMsg}</p>
  {/if}
  
  <form on:submit|preventDefault={login}>
    <label for="username">Usuário:</label>
    <input type="text" id="username" bind:value={username} required />
  
    <label for="password">Senha:</label>
    <input type="password" id="password" bind:value={password} required />
  
    <button type="submit">Entrar</button>
  </form>

  