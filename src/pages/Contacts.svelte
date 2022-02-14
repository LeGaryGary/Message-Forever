<script>
  import ago from 's-ago';
  import { get } from 'svelte/store';

  import NavBar from '../components/NavBar.svelte';
  import AddContact from '../components/AddContactButton.svelte';
  import BackToHomeButton from '../components/BackToHomeButton.svelte';

  import Messages from '../components/Messages.svelte';

  import { contacts, selectedContact } from '../data-interfaces/mf/contacts';

  import { GetPrivateMessageStore } from '../data-interfaces/mf/messages';

  async function getLastMessage(contact) {
    var store = GetPrivateMessageStore(contact.address);
    var messages = get(store);
    if (messages.length == 0) return null;

    return messages[messages.length - 1];
  }

  function truncate(str, n){
  return (str.length > n) ? str.substr(0, n-1) + '...' : str;
};
</script>

{#if $selectedContact}
  <Messages
    title={$selectedContact.name}
    mode="private"
    selected={$selectedContact}
  />
{:else}
  <div class="contacts no-drag">
    <NavBar
      backNavItem={BackToHomeButton}
      rightNavItems={[AddContact]}
      title="contacts"
    />

    {#each $contacts as contact}
      <div class="contact" on:click={() => selectedContact.set(contact)}>
        <img
          src={contact.iconUrl}
          alt="Arvatar"
          class="contact-item no-select"
        />
        <div class="contact-item contact-container">
          {#await getLastMessage(contact)}
            <div>
              <span class="bold">{contact.name}</span>
            </div>
            <div>loading last message...</div>
          {:then lastMessage}
            <div>
              <span class="bold">{contact.name}</span>
            </div>
            {#if lastMessage}
            <div>
              <i>{lastMessage.time ?? ''}</i>
            </div>
            <div>{truncate(lastMessage.content, 37)}</div>
            {:else}
            <div><em>No messages to show</em></div>
            {/if}
          {/await}
        </div>
      </div>
      <hr />
    {/each}
  </div>
{/if}

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
    transform: scale(0.995);
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
