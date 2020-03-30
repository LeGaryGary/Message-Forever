<script>
  import Home from './pages/Home.svelte'
  import Private from './pages/Private.svelte'
  import Groups from './pages/Groups.svelte'
  import Channels from './pages/Channels.svelte'

  import Login from './pages/Login.svelte'

  import {page} from './data-interfaces/page'
  import {user} from './data-interfaces/user'
</script>

{#if $user === null}
  <Login/>
{:else}
  {#if $page === 'Home'}
    <Home/>
  {:else if $page === 'Private'}
    <Private/>
  {:else if $page === 'Groups'}
    <Groups/>
  {:else if $page === 'Channels'}
    <Channels/>
  {:else}
    <p>Not found!</p>
  {/if}
{/if}