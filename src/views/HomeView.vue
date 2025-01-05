<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useRulesStore } from '@/stores/rulesStore';
import LandingDescription from '../components/LandingDescription.vue';
import ExtensionUploadArea from '../components/ExtensionUploadArea.vue';
import OverlayCard from '@/components/OverlayCard.vue';
import { useManifestStore } from '@/stores/manifestStore';

const rulesStore = useRulesStore();
const manifestStore = useManifestStore();
let filesUploaded = computed(() => rulesStore.parsedRulesList.length > 0);
let isFirstVisit = computed(() => manifestStore.isFirstVisit);

const router = useRouter();

function goToRequests() {
  if (filesUploaded.value) {
    router.push({ name: 'requests' });
  } else {
    alert('Please upload files before proceeding to the Requests Playground.');
  }
}
</script>

<template>
  <main>
    <OverlayCard v-show="isFirstVisit" />
    <header>
      <div class="left-section">
        <img
          alt="Google Chrome Labs"
          class="logo"
          src="@/assets/ChromeLabsLogo.png"
          width="65"
          height="65"
        />
        <LandingDescription />
      </div>
      <div class="right-section">
        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/rules">Rules Editor</RouterLink>
          <RouterLink to="/requests">Requests Playground</RouterLink>
        </nav>
      </div>
    </header>
    <div class="upload-area">
      <h2>Upload Extension Files</h2>
      <FileUploadHeading>
        <template #icon>
          <ExtensionIcon />
        </template>
        <template #heading>Upload Manifest</template>
        <label class="drop-zone-label">
          <div
            class="drop_zone"
            id="manifest_drop_zone"
            @drop="manifestInputHandler"
            @dragover="dragOverHandler"
          >
            <p v-if="!manifestFileName">
              Drag <code>manifest.json</code> file, or click to browse ...
            </p>
            <p v-else>{{ manifestFileName }}</p>
            <input
              type="file"
              id="manifest_file_input"
              @change="manifestInputHandler"
            />
          </div>
        </label>
      </FileUploadHeading>
      <FileUploadHeading v-show="manifestFileName">
        <template #icon>
          <ExtensionIcon />
        </template>
        <template #heading>Upload Ruleset Files</template>
        <label class="drop-zone-label">
          <div
            class="drop_zone"
            id="ruleset_drop_zone"
            @drop="rulesetFilesInputHandler"
            @dragover="dragOverHandler"
          >
            <p v-if="rulesetFileNames === ''">
              Drag one or more ruleset files, or click to browse...
            </p>
            <p v-else>{{ rulesetFileNames }}</p>
            <input
              type="file"
              id="ruleset_files_input"
              @change="rulesetFilesInputHandler"
              multiple
            />
          </div>
        </label>
      </FileUploadHeading>
    </div>
    <button v-show="filesUploaded" @click="goToRequests" class="request-button">
      Go to Requests Playground
    </button>
  </main>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--color-background-soft);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.left-section {
  display: flex;
  align-items: center;
}

.logo {
  margin-right: 1rem;
}

.right-section {
  display: flex;
  align-items: center;
}

nav {
  display: flex;
  gap: 1rem;
}

nav a {
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
}

nav a:hover {
  background-color: var(--color-border-hover);
  color: var(--color-text);
}

.upload-area {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
  color: var(--color-heading);
}

.drop_zone {
  border: 2px dashed var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  transition: background-color 0.3s;
}

.drop_zone:hover {
  background-color: hsla(160, 100%, 37%, 0.1);
}

.drop-zone-label {
  display: block;
  cursor: pointer;
}

input[type='file'] {
  display: none;
}

.request-button {
  margin-top: 2rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-heading);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.request-button:hover {
  background-color: darken(var(--color-heading), 10%);
}
</style>