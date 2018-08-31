<template>
  <div class="sa-login">
      <PageHeader/>
      <Service/>
  </div>
</template>
<script>
import Service from './components/service';
import PageHeader from './components/page-header';
export default {
    components:{
        Service,PageHeader
    },
    data(){
        return {

        }
    }
}
</script>

