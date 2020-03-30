<script>
  import { user, updateUser } from '../data-interfaces/user';
  export function fileAdded(event) {
    const fileReader = new FileReader();
    fileReader.onload = e => {
      const newUser = {};
      newUser.wallet = JSON.parse(e.target.result);
      updateUser(newUser).then(modifiedUser => user.set(modifiedUser));
    };
    fileReader.readAsText(event.target.files[0]);
  }
</script>

<style>
  .outer {
    display: table;
    height: 100%;
    width: 100%;
  }
  .inner {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
  }

  [type='file'] {
    border: 0;
    clip: rect(0, 0, 0, 0);
    height: 1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }

  [type='file'] + label {
    background-color: #aaa;
    border-radius: 0.317rem;
    color: #fff;
    cursor: pointer;
    display: inline-block;
    padding: 2rem 4rem;
  }

  [type='file']:focus + label,
  [type='file'] + label:hover {
    opacity: 0.85;
  }

  [type='file']:focus + label {
    outline: 1px dotted #000;
  }
</style>

<div class="outer">
  <div class="inner">
    <input
      type="file"
      id="file"
      class="custom-file-input"
      on:change={fileAdded} />
    <label for="file">Login with your wallet</label>
  </div>
</div>
