<script>
  import { user } from '../data-interfaces/mf/user';
  import { arweave, AddressExists } from '../data-interfaces/arweave';

  import { CreateContact } from '../data-interfaces/mf/contacts';

  import Modal from './Modal.svelte';

  let showModal = false;
  let validContact = false;

  let address;
  let makingContact = false;
  let addressValid = false;

  async function addContact(event) {
    addressValid = address && address.length === 43 && await AddressExists(address);
    if (event.keyCode === 13) {
      // Enter key pressed
      event.preventDefault();
      if (!addressValid) return;
      console.log('adding contact address: ', address);
      
      if (makingContact) return;
      makingContact = true;
      await CreateContact(address);
      makingContact = false;
    }
  }

  function init(element) {
    element.focus();
  }
</script>

<style>
  .add-contact {
    font-size: max(1.8vw, 1.8vh, 1.2em);
    position: relative;
    left: max(0.1vw, 0.1vh);
    top: max(0.6vw, 0.6vh, 0.3em);
  }
  .validation-icon {
    padding-left: 5px;
    font-size: 2em;
  }
  input {
    font-size: 1em;
  }
  .flex-container {
    display: flex;
  }
</style>

<div on:click={() => (showModal = true)} class="button circle">
  <i class="fas fa-user-plus add-contact" />
</div>

{#if showModal}
  <Modal closeModal={() => (showModal = false)}>
    <div class="flex-container">
      <input bind:value={address} on:keyup={addContact} type="text" placeholder="Wallet Address" use:init />
      {#if makingContact}
        <i class="fas fa-cog validation-icon" />
      {:else if addressValid}
        <i class="fas fa-check-circle validation-icon" />
      {:else}
        <i class="far fa-times-circle validation-icon" />
      {/if}
    </div>
  </Modal>
{/if}
