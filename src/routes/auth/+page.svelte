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
              goto('/home'); // Redireciona para a home após o login
          } else {
              const result = await response.json();
              errorMsg = result.message || 'Falha no login.';
          }
      } catch (error) {
          errorMsg = 'Erro ao tentar conectar com o servidor.';
      }
  }
</script>
<center>
<div class="login-container">
  <h1>Login</h1>

  {#if errorMsg}
      <p class="error-message">{errorMsg}</p>
  {/if}

  <form on:submit|preventDefault={login}>
      <label for="username">Usuário:</label>
      <input type="text" id="username" bind:value={username} required />

      <label for="password">Senha:</label>
      <input type="password" id="password" bind:value={password} required />

      <button type="submit">Entrar</button>
  </form>
</div>
</center>
<style>


  .login-container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
      width: 90%;
      max-width: 400px;
  }

  h1 {
      color: #333;
      font-size: 24px;
      margin-bottom: 20px;
  }

  .error-message {
      color: red;
      background: #ffe6e6;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 15px;
  }

  form {
      display: flex;
      flex-direction: column;
  }

  label {
      text-align: left;
      font-weight: bold;
      margin-bottom: 5px;
      font-size: 14px;
      color: #333;
  }

  input {
      padding: 10px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-bottom: 15px;
      width: 100%;
  }

  button {
      background: #41644A;
      color: white;
      font-size: 18px;
      border: none;
      padding: 12px;
      border-radius: 5px;
      cursor: pointer;
      transition: background 0.3s;
  }

  button:hover {
      background: #2f4a32;
  }

  /* Responsividade para telas maiores */
  @media (min-width: 768px) {
      .login-container {
          padding: 30px;
      }

      h1 {
          font-size: 28px;
      }

      button {
          font-size: 20px;
          padding: 14px;
      }
  }
</style>
