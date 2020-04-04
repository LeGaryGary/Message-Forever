<script>
  import { selectedContact } from '../data-interfaces/mf/contacts';
  import BackButton from './BackButton.svelte';
</script>

<BackButton callback={() => selectedContact.set(null)} />
