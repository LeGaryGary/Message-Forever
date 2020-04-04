<script>
  import Home from './pages/Home.svelte';
  import Contacts from './pages/Contacts.svelte';
  import Groups from './pages/Groups.svelte';
  import Channels from './pages/Channels.svelte';

  import Login from './pages/Login.svelte';

  import { page } from './data-interfaces/mf/page';
  import { user } from './data-interfaces/mf/user';
</script>

{#if $user === null}
  <Login />
{:else}
  {#if $page === 'home'}
    <Home />
  {:else if $page === 'contacts'}
    <Contacts />
  {:else if $page === 'groups'}
    <Groups />
  {:else if $page === 'channels'}
    <Channels />
  {:else}
    <p>Not found!</p>
  {/if}
{/if}
