<script>
  import { page } from "../data-interfaces/mf/page";
  export let pageName;
</script>

<style>
  .button {
    display: table;
    width: 100%;
    height: 100%;
  }
  .page-name {
    display: table-cell;
    vertical-align: middle;
  }
</style>

<div class='button' on:click={() => page.set(pageName)}>
  <div class='page-name b-font'>{pageName}</div>
</div>
