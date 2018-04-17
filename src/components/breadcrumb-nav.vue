<template>
    <Breadcrumb>
        <BreadcrumbItem 
            v-for="item in currentPath" 
            :href="item.path" 
            :key="item.name"
        >{{ item.title }}</BreadcrumbItem>
    </Breadcrumb>
</template>

<script>
import {Breadcrumb,BreadcrumbItem} from 'iview';
export default {
    name: 'breadcrumbNav',
    props: {
        currentPath: Array
    },
    components:{
        Breadcrumb,BreadcrumbItem
    }
};
</script>

