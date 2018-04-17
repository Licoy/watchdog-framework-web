<template>
  <div class="sa-login">
      <PageHeader/>
      <Login/>
  </div>
</template>
<script>
import Login from '@/components/login/Login';
import PageHeader from '@/components/login/PageHeader';
export default {
    components:{
        Login,PageHeader
    },
    data(){
        return {

        }
    }
}
</script>

