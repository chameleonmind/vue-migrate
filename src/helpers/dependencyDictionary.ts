const dependencyDictionary: Record<string, { name: string, version: string }> = {
  vuex: {
    name: 'vuex',
    version: '^4.0.2'
  },
  '@vue/test-utils': {
    name: '@vue/test-utils',
    version: '^2.3.2'
  },
  'vee-validate': {
    name: 'vee-validate',
    version: '^4.8.4'
  },
  'vue2-datepicker': {
    name: 'vue-datepicker-next',
    version: '^1.0.3'
  },
  '@vue/vue2-jest': {
    name: '@vue/vue3-jest',
    version: '^29.2.3'
  },
  'element-ui': {
    name: 'element-plus',
    version: '^2.3.2'
  },
  'vue-multiselect': {
    name: 'vue-multiselect',
    version: '^3.0.0-beta.1'
  },
  'vue-router': {
    name: 'vue-router',
    version: '^4.1.6'
  }
}

export function replaceDependencies (existingDependencies: Record<string, string>): Record<string, string> {
  return Object.entries(existingDependencies).reduce((acc: Record<string, string>, [key, value]) => {
    if (dependencyDictionary[key] !== undefined) {
      acc[dependencyDictionary[key].name] = dependencyDictionary[key].version
    } else {
      acc[key] = value
    }
    return acc
  }, {})
}
