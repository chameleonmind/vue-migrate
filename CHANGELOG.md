# @chameleonmind/vue-migrate

## 0.0.1

### Vue migrate first version
- Migrate vue-cli projects with webpack to Vue2 projects with Vite
- Migrate vue-cli projects with webpack to Vue3 compatibility build with Vite
- Migrate vue-cli projects with Webpack to Vue3 with Vite (not really recommended, use only if you definitely know what
  you're doing, try the compat build instead)
- Automatically change run commands (change vue-cli commands to vite commands)
- Automatically migrate environment variables (change VUE_APP_ prefixes to VITE_)
- Automatically add appropriate Vite config
- Automatically move index.html and replace Webpack-related code in it (may require some manual work after)
