<script>
  import BackToHomeButton from '../components/BackToHomeButton.svelte';

  import { contacts } from '../data-interfaces/contacts';
</script>

<style>
  .navbar {
    display: table;
  }
  .navitem {
    display: table-cell;
    vertical-align: middle;
  }
</style>

<div class="contacts">
  <div class="navbar">
    <BackToHomeButton />
    <span class="navitem">Test</span>
  </div>

  <hr />
  {#each $contacts as contact}
    <div>
      {contact.identifier}
      <hr />
    </div>
  {/each}
</div>
