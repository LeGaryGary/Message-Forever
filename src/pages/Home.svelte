<script>
  import PageButton from '../components/PageButton.svelte';
  import { user } from '../data-interfaces/user'
</script>

Logged in as {$user.identifier || $user.address}

<div class="flex-grid-thirds gutters">
  <div class='col'>
    <PageButton pageName="Private" />
  </div>
  <div class='col'>
    <PageButton pageName="Groups" />
  </div>
  <div class='col'>
    <PageButton pageName="Channels" />
  </div>
</div>
