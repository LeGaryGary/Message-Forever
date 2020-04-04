<script>
  import ago from 's-ago';

  import NavBar from '../components/NavBar.svelte';
  import AddContact from '../components/AddContactButton.svelte';
  import BackToHomeButton from '../components/BackToHomeButton.svelte';

  import Messages from '../components/Messages.svelte'

  import {
    contacts,
    TransactionContactConverter,
    selectedContact
  } from '../data-interfaces/mf/contacts';

  async function getLastMessage(contact) {
    console.log(contact);
    return {
      timeContext: ago(new Date(1585968180 * 1000)),
      text: 'not a fcking boring filler message'
    };
  }
</script>

<style>
  img {
    width: max(6vw, 6vh, 4em);
    height: max(6vw, 6vh, 4em);
    border-radius: 50%;
  }
  .contact {
    display: flex;
    padding: 10px 0;
    transition: transform ease-out 0.1s, background 0.2s;
    cursor: pointer;
  }
  .contact:hover {
    transform: scale(0.98);
    opacity: 0.85;
  }
  .contact-item {
    align-self: center;
    margin: 0 10px;
  }
  .contact-container {
    display: flex;
    flex-direction: column;
  }
  hr {
    margin: 0;
  }
</style>

{#if $selectedContact}
  <Messages title={$selectedContact.name} mode='private' selected={$selectedContact}/>
{:else}
  <div class="contacts no-drag">
    <NavBar
      backNavItem={BackToHomeButton}
      rightNavItems={[AddContact]}
      title="contacts" />

    {#each $contacts as contact}
      <div
        class="contact"
        on:click={() => selectedContact.set(contact)}>
        <img
          src={contact.iconUrl}
          alt="Arvatar"
          class="contact-item no-select" />
        <div class="contact-item contact-container">
          {#await getLastMessage(contact)}
            <div>{contact.name}</div>
            <div>
              <i class="fas fa-cog validation-icon" />
            </div>
          {:then lastMessage}
            <div>
              <span class="bold">{contact.name}</span>
            </div>
            <div>
              <i>{lastMessage.timeContext}</i>
            </div>
            <div>{lastMessage.text}</div>
          {/await}
        </div>
      </div>
      <hr />
    {/each}

  </div>
{/if}
