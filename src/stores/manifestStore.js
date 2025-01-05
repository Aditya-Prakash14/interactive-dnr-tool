import { defineStore } from 'pinia';

export const useManifestStore = defineStore('manifest', {
  state: () => ({
    rulesetFilePaths: [],
    isFirstVisit: true
  }),
  getters: {
    getRulesetFilePaths(state) {
      return state.rulesetFilePaths;
    }
  },
  actions: {
    setIsFirstVisit(value) {
      this.isFirstVisit = value;
    },
    clearRulesetFilePaths() {
      this.rulesetFilePaths = [];
    },
    setRulesetFilePaths(manifest) {
      if (manifest.declarative_net_request.rule_resources) {
        manifest.declarative_net_request.rule_resources.forEach((ruleset) => {
          const rulesetFilePath = ruleset.path;
          const rulesetFileName = rulesetFilePath.split('/').pop();

          this.rulesetFilePaths.push({
            rulesetFileName: rulesetFileName,
            rulesetFilePath: rulesetFilePath,
            rulesetId: ruleset.id,
            isEnabled: ruleset.enabled
          });
        });
      }
    },
    toggleRulesetAvailability(rulesetFileName) {
      const rulesetFilePathObject = this.rulesetFilePaths.find(
        (ruleset) => ruleset.rulesetFileName === rulesetFileName
      );
      if (rulesetFilePathObject) {
        rulesetFilePathObject.isEnabled = !rulesetFilePathObject.isEnabled;
      }
    },
    isValidManifest(manifest) {
      let syntaxError = {
        type: [],
        missingFields: [],
        invalidValueTypes: [],
        isError: false
      };

      const requiredFieldsAndTypes = {
        name: 'string',
        version: 'string',
        manifest_version: 'number',
        permissions: 'array'
      };

      for (let field of Object.keys(requiredFieldsAndTypes)) {
        if (!Object.prototype.hasOwnProperty.call(manifest, field)) {
          syntaxError.isError = true;
          if (!syntaxError.type.includes('missingFields')) {
            syntaxError.type.push('missingFields');
            syntaxError.missingFields = [];
          }
          syntaxError.missingFields.push(field);
        } else {
          const expectedType = requiredFieldsAndTypes[field];
          const actualValue = manifest[field];
          if (expectedType === 'array' && !Array.isArray(actualValue)) {
            syntaxError.isError = true;
            if (!syntaxError.type.includes('invalidValueTypes')) {
              syntaxError.type.push('invalidValueTypes');
              syntaxError.invalidValueTypes = [];
            }
            syntaxError.invalidValueTypes.push(field);
          } else if (typeof actualValue !== expectedType) {
            syntaxError.isError = true;
            if (!syntaxError.type.includes('invalidValueTypes')) {
              syntaxError.type.push('invalidValueTypes');
              syntaxError.invalidValueTypes = [];
            }
            syntaxError.invalidValueTypes.push(field);
          }
        }
      }

      // Additional field checks can be added here...

      if (syntaxError.isError) {
        return syntaxError;
      } else {
        return true;
      }
    }
  },
  persist: {
    storage: sessionStorage,
    paths: ['rulesetFilePaths', 'isFirstVisit']
  }
});

