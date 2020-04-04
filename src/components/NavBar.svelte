<script>
  import BackToHomeButton from '../components/BackToHomeButton.svelte';

  export let backNavItem;
  export let rightNavItems = [];
  export let title;
</script>

<style>
  .navbar-container {
    display: flex;
    justify-content: space-between;
    /* padding */
  }
  .navbar-left {
    flex: 1;
    display: flex;
    flex-direction: row;
  }
  .navbar-center {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .navbar-right {
    flex: 1;
    display: flex;
    flex-direction: row-reverse;
  }
  .nav-item {
    margin: 5px max(0.5vw, 0.5vh, 5px);
    display: inline-flex;
    align-items: center;
  }
  hr {
    margin: 0;
  }
</style>

<div class="navbar-container no-select no-drag">
  <span class="navbar-left">
    <span class="nav-item">
      <svelte:component this={backNavItem} />
    </span>
  </span>
  <span class="navbar-center">
    <span class="nav-item m-font">{title}</span>
  </span>
  <span class="navbar-right">
    {#each rightNavItems as rightNavItem}
      <span class="nav-item">
        <svelte:component this={rightNavItem} />
      </span>
    {/each}
  </span>
</div>
<hr/>