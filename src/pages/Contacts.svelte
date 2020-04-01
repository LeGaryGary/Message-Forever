<script>
  import NavBar from '../components/NavBar.svelte';
  import AddContact from '../components/AddContactButton.svelte';
  import BackToHomeButton from '../components/BackToHomeButton.svelte';

  import {
    contacts,
    TransactionContactConverter
  } from '../data-interfaces/mf/contacts';
</script>

<div class="contacts">
  {#await Promise.resolve($contacts.map(TransactionContactConverter))}
    <NavBar backNavItem={BackToHomeButton} title="contacts" />
  {:then contacts}
    <NavBar
      backNavItem={BackToHomeButton}
      rightNavItems={[AddContact]}
      title="contacts" />
    {#each contacts as contact}
      {contact.identifier}
      <hr />
    {/each}
  {/await}
</div>
