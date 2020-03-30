<script>
  import { page } from "../data-interfaces/page";
  export let pageName;
</script>

<style>
  .button {
    display: table;
    width: 100%;
    height: 100%;
    font-size: max(5vw, 5vh);
    border-radius: 5px;
  }
  .page-name {
    display: table-cell;
    vertical-align: middle;
  }
</style>

<div class='button' on:click={() => page.set(pageName)}>
  <div class='page-name'>{pageName}</div>
</div>
