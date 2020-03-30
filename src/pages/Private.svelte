<script>
  import BackToHomeButton from "../components/BackToHomeButton.svelte";

  import { contacts } from "../data-interfaces/contacts";
</script>

<div class="contacts">
  <BackToHomeButton />
  <hr />
  {#each $contacts as contact}
    <div>
      {contact.identifier}
      <hr />
    </div>
  {/each}
</div>
