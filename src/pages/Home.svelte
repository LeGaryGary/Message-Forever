<script>
  import PageButton from '../components/PageButton.svelte';
  import { user } from '../data-interfaces/mf/user'
  import { GetCurrentVersionData } from '../data-interfaces/mf'

  let versionData = GetCurrentVersionData();
</script>

<style>
.logged-in {
  text-align: center;
  padding-top: max(2vh,2vw);
}
.footer {
  text-align: center;
  padding: max(2vh,2vw) 0;
}
.flex-grid-thirds {
  display: flex;
  justify-content: space-between;
}
.flex-grid-thirds .col {
  width: 28vw;
  height: 28vw;
}

@media (max-width: 500px) {
  .flex-grid-thirds {
    display: block;
  }
  .flex-grid-thirds .col {
    width: 80vw;
    height: 80vw;
    margin: 10px auto;
  }
}
</style>

<div class='logged-in s-font'>logged in as {$user.name || $user.address}</div>

<div class="flex-grid-thirds gutters">
  <div class='col'>
    <PageButton pageName="contacts" />
  </div>
  <div class='col'>
    <PageButton pageName="groups" />
  </div>
  <div class='col'>
    <PageButton pageName="channels" />
  </div>
</div>

<div class='footer s-font'>~ <a href='https://securemessage.space'>securemessage.space</a> made by <a href='https://garygary.uk'>gary gary</a> with ❤️ ~ {versionData.name} ~</div>