<script>
  import NavBar from './NavBar.svelte';
  import BackDeselectContactButton from './BackDeselectContactButton.svelte'

  import {LookupNameAsync} from '../data-interfaces/arweave/applications/arweaveId'

  export let mode;
  export let selected;

  export let title;
</script>

<NavBar
      backNavItem={BackDeselectContactButton}
      title={title} />