<script>
  import { user } from '../data-interfaces/mf/user';
  import { LookupWalletAddress } from '../data-interfaces/arweave/applications/arweaveId';
  import { arweave } from '../data-interfaces/arweave';

  import { CreateContact } from '../data-interfaces/mf/contacts';

  import Modal from './Modal.svelte';

  let showModal = false;
  let validContact = false;

  let name;

  async function lookUp(name) {
    try {
      return await LookupWalletAddress(name);
    } catch (e) {
      console.log(e);
    }
    return null;
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function addContact(event) {
    if (event.keyCode === 13) {
      // Enter key pressed
      event.preventDefault();
      const address = await LookupWalletAddress(name);
      if (!address) return;
      console.log('adding contact: ', name);
      console.log('contact address: ', address);
      await CreateContact(address);
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
      <input bind:value={name} on:keyup={addContact} type="text" use:init />
      {#await lookUp(name)}
        <i class="fas fa-cog validation-icon" />
      {:then address}
        {#if address}
          <i class="fas fa-check-circle validation-icon" />
        {:else}
          <i class="far fa-times-circle validation-icon" />
        {/if}
      {/await}
    </div>
  </Modal>
{/if}
