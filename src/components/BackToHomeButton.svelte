<script>
  import { page } from '../data-interfaces/page';
</script>

<style>
  i {
    color: grey;
    font-size: max(5vw, 5vh);
    margin: 8px 0 0 8px;
  }
  i:hover {
    opacity: 0.85;
  }
</style>

<i on:click={() => page.set('Home')} class="fas fa-chevron-circle-left" />
