<script>
  import { page } from '../data-interfaces/mf/page';
</script>

<style>
  i {
    font-size: max(3vw, 3vh, 2em);
    position: relative;
    right: max(0.2vw, 0.2vh, 0.05em);
  }
</style>

<div on:click={() => page.set('home')} class="button circle">
  <i class="fas fa-chevron-left" />
</div>
