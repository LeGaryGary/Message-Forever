<script>
  import { fade, fly } from 'svelte/transition';
  export let closeModal;
</script>

<style>
  .modal {
    position: absolute; /* Stay in place */
    z-index: 1; /* Sit on top */
    padding-top: 100px; /* Location of the box */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0, 0, 0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
  }

  .modal-content {
    position: relative;
    background-color: #fefefe;
    margin: auto;
    padding: 30px;
    border-radius: 10px;
    width: 250px;
  }

  .close {
    position: absolute;
    right: 5px;
    top: -3px;
    font-size: 2em;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    text-decoration: none;
    cursor: pointer;
  }
</style>

<div class="modal" transition:fade={{ duration: 300 }}>
  <div class="modal-content" transition:fly={{ y: 200, duration: 300 }}>
    <span class="close" on:click={closeModal}>&times;</span>
    <slot />
  </div>

</div>