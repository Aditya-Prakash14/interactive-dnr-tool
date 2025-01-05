<script setup>
import { useRouter } from 'vue-router';
import 'jsoneditor/dist/jsoneditor.css';
import JSONRulesEditor from '@/components/JSONRulesEditor.vue';
import { useRulesStore } from '@/stores/rulesStore';
import { onMounted, computed } from 'vue';

const rulesStore = useRulesStore();
const parsedRulesList = computed(() => rulesStore.parsedRulesListLength);
const router = useRouter();

onMounted(() => {
  if (parsedRulesList.value === 0) {
    const result = confirm('0 parsed rules found. Proceed to upload ruleset file(s)?');
    if (result) {
      router.push({ name: 'home' });
    }
  }
});
</script>

<template>
  <main class="rules-editor-view">
    <h1 class="page-title">Rules Editor</h1>
    <nav class="main-nav">
      <RouterLink to="/" class="nav-link">Home</RouterLink>
      <RouterLink to="/requests" class="nav-link">Requests Playground</RouterLink>
    </nav>
    <div class="editor-container">
      <JSONRulesEditor />
    </div>
  </main>
</template>

<style scoped>
.rules-editor-view {
  display: flex;
  flex-direction: column;
  padding: 3rem;
  gap: 3rem;
  min-height: 100vh;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
  text-align: center;
}
</style>