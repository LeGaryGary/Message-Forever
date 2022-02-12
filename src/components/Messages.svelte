<script>
  import NavBar from './NavBar.svelte';
  import BackDeselectContactButton from './BackDeselectContactButton.svelte';

  import {
    SendPrivateMessage,
    GetPrivateMessageStore
  } from '../data-interfaces/mf/messages';
  import { UnixTimeToMessageTime } from '../data-interfaces/time';
  import { LookupAvatarAsync } from '../data-interfaces/arweave/applications/arvatar';
  import { user } from '../data-interfaces/mf/user';

  export let mode;
  export let selected;
  export let title;

  let newMessage;

  async function sendMessage() {
    if (!newMessage) return;
    console.log(newMessage);
    if (mode == 'private') {
      SendPrivateMessage(newMessage, selected.address);
    }
    newMessage = '';
  }

  let messages;
  if (mode == 'private') messages = GetPrivateMessageStore(selected.address);
</script>

<NavBar backNavItem={BackDeselectContactButton} {title} />

<div class="messages">
  {#each $messages as message}
    {#await LookupAvatarAsync(message.fromAddress) then avatar}
      {#if $user.address == message.fromAddress}
        <div class="container">
          <!-- Need to put in avatars like in contacts -->
          <img
            src={avatar}
            alt="Arvatar"
            class="contact-item no-select avatar"
          />
          <p>{message.content}</p>
          <span>{UnixTimeToMessageTime(message.time)}</span>
        </div>
      {:else}
        <div class="container darker">
          <!-- Need to put in avatars like in contacts -->
          <img src={avatar} alt="Arvatar" class="contact-item no-select" />
          <p>{message.content}</p>
          <span>{UnixTimeToMessageTime(message.time)}</span>
        </div>
      {/if}
    {/await}
  {/each}
</div>

<div class="message-box-background">
  <div class="message-box">
    <input
      contenteditable="true"
      class="message-input"
      bind:value={newMessage}
    />
    <i class="far fa-paper-plane send" on:click={sendMessage} />
  </div>
</div>

<style>
  .messages {
    overflow-y: scroll;
  }
  .message-box-background {
    background-color: white;
    width: 100%;
    height: 40px;
    position: fixed;
    left: 50%;
    bottom: 0px;
    transform: translate(-50%, -20%);
    border-radius: 20px;
  }
  .message-box {
    width: 98%;
    border-radius: 20px;
    height: 24px;
    border: 1px solid #ccc;
    position: fixed;
    left: 50%;
    bottom: 0px;
    transform: translate(-50%, -20%);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .message-input {
    background: none;
    border: none;
    padding: 0;
    outline: none;
    resize: none;
    overflow: auto;
    font-size: 15px;
    height: 20px;
    width: calc(100% - 30px);
    color: #444;
  }
  .send {
    cursor: pointer;
  }
  .container {
    border: 2px solid #dedede;
    background-color: #f1f1f1;
    border-radius: 5px;
    padding: 10px;
    margin: 10px 0;
  }
  .darker {
    border-color: #ccc;
    background-color: #ddd;
  }
  .avatar {
    width: max(6vw, 6vh, 4em);
    height: max(6vw, 6vh, 4em);
    border-radius: 50%;
  }
</style>
