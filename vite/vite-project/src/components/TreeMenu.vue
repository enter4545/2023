<template>
    <template v-for="menu in props.userMenu" :key="menu._id">
        <el-sub-menu v-if="menu.children && menu.children.length > 0 && menu.children[0].menuType == 1" index="menu.path">
            <template #title>
              <el-icon><component :is="menu.icon"></component></el-icon>
              <span>{{ menu.menuName }}</span>
            </template>
            <tree-menu :userMenu="menu.children"></tree-menu>
        </el-sub-menu>
        <el-menu-item v-else-if="menu.menuType == 1" :index="menu.path">{{ menu.menuName }}</el-menu-item>
    </template>
</template>

<script setup>
import { defineProps } from 'vue';
import TreeMenu from './TreeMenu.vue'    //自己调用自己，递归

const props = defineProps(["userMenu"]);
</script>

<style scoped>

</style>