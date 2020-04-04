<script>
  import { page } from '../data-interfaces/mf/page';
  import BackButton from './BackButton.svelte'
</script>

<BackButton callback={() => page.set('home')}/>