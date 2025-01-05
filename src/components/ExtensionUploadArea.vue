<script setup>
import { ref } from 'vue';
import { useManifestStore } from '@/stores/manifestStore';
import { useRulesStore } from '@/stores/rulesStore';
import FileUploadHeading from './FileUploadHeading.vue';
import ExtensionIcon from './icons/IconExtension.vue';

const manifestStore = useManifestStore();
const rulesStore = useRulesStore();

let manifestFileName = ref('');
let manifestFile = null;
let rulesetFileNames = ref('');

function parseManifestFile(manifestFile) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const manifestObject = JSON.parse(e.target.result);
      const manifestValidationResult = manifestStore.isValidManifest(manifestObject);
      if (manifestValidationResult === true) {
        manifestFileName.value = manifestFile.name;
        manifestStore.clearRulesetFilePaths();
        manifestStore.setRulesetFilePaths(manifestObject);
      } else {
        let output = 'Issues found:\n';
        if (manifestValidationResult.type.includes('missingFields')) {
          const missingFields = manifestValidationResult.missingFields.join(', ');
          output += `- Missing fields: ${missingFields}\n`;
        }
        if (manifestValidationResult.type.includes('invalidValueTypes')) {
          const invalidValueTypes = manifestValidationResult.invalidValueTypes.join(', ');
          output += `- Invalid value types for: ${invalidValueTypes}\n`;
        }
        window.alert(output);
      }
    } catch (error) {
      console.error('Error parsing manifest JSON:', error);
      window.alert('Error parsing manifest JSON. Please ensure the file is valid.');
    }
  };
  reader.readAsText(manifestFile);
}

function manifestInputHandler(ev) {
  ev.preventDefault();
  let files = ev.dataTransfer ? ev.dataTransfer.items : ev.target.files;

  if (files.length === 0) {
    window.alert('No files were dropped');
    return;
  } else if (files.length > 1) {
    window.alert('Only one file can be dropped at a time');
    return;
  }

  manifestFile = files[0].getAsFile ? files[0].getAsFile() : files[0];
  parseManifestFile(manifestFile);
}

function parseRulesetFile(rulesetFile) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const ruleset = JSON.parse(e.target.result);
      let rulesetValidationResult = rulesStore.isValidRuleset(ruleset);
      if (rulesetValidationResult === true) {
        rulesStore.setParsedRulesList(ruleset, manifestFileName.value);
      } else {
        let output = 'Issues found:\n';
        if (rulesetValidationResult.type.includes('missingFields')) {
          const missingFields = rulesetValidationResult.missingFields.join(', ');
          output += `- Missing fields: ${missingFields}\n`;
        }
        if (rulesetValidationResult.type.includes('invalidValueTypes')) {
          const invalidValueTypes = rulesetValidationResult.invalidValueTypes.join(', ');
          output += `- Invalid value types for: ${invalidValueTypes}\n`;
        }
        window.alert(output);
      }
    } catch (error) {
      console.log(error);
      window.alert('Error parsing ruleset JSON');
    }
  };
  reader.readAsText(rulesetFile);
}

function rulesetFilesInputHandler(ev) {
  ev.preventDefault();
  let files = ev.dataTransfer ? ev.dataTransfer.items : ev.target.files;

  if (files.length === 0) {
    window.alert('One or more files expected');
    return;
  }

  let rulesetFiles = Array.from(files).map(file => file.getAsFile ? file.getAsFile() : file);
  rulesetFileNames.value = rulesetFiles.map(file => file.name).join(', ');

  rulesetFiles.forEach(file => parseRulesetFile(file));
}

function dragOverHandler(ev) {
  ev.preventDefault();
}

function removeDragData(ev) {
  try {
    if (ev.dataTransfer) {
      ev.dataTransfer.items.clear();
    } else {
      ev.target.value = ''; // Clear the file input element
    }
  } catch (e) {
    document.getElementById('manifest_file_input').value = '';
    document.getElementById('ruleset_files_input').value = '';
  }
}
</script>

<template>
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
          Drag manifest.json file, or click to browse ...
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
  <br />
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
</template>

<style scoped>
.drop_zone {
  border: 2px dashed var(--color-border);
  width: 200px;
  height: 100px;
}
input[type='file'] {
  display: none;
}
</style>
