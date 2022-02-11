<script>
  import NavBar from './NavBar.svelte';
  import BackDeselectContactButton from './BackDeselectContactButton.svelte';

  import { SendPrivateMessage } from '../data-interfaces/mf/messages';

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

  const messages = [{ fromAddress: "", recipentAddress: "", fromName: "", content: 'test' }];
</script>

<NavBar backNavItem={BackDeselectContactButton} {title} />

{#each messages as message}
  <div class="container">
    <img src="/w3images/bandmember.jpg" alt="Avatar" />
    <p>{message.content}</p>
    <span class="time-right">11:00</span>
  </div>
{/each}

<div class="message-box">
  <input contenteditable="true" class="message-input" bind:value={newMessage} />
  <i class="far fa-paper-plane send" on:click={sendMessage} />
</div>

<style>
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
</style>
