# Vue Migrate

Vue Migrate is a small npm package created to take the boring and time-consuming parts that can be automated of
migrating your Vue2
projects to Vue3 with Vite off your hands.
It automates some parts of the migration process, including the transition from Webpack to Vite.
Some things you will need to do manually, but this package should help you get started.

## Features

- Migrate vue-cli projects with webpack to Vue2 projects with Vite
- Migrate vue-cli projects with webpack to Vue3 compatibility build with Vite
- Migrate vue-cli projects with Webpack to Vue3 with Vite (not really recommended, use only if you definitely know what
  you're doing, try the compat build instead)
- Automatically change run commands (change vue-cli commands to vite commands)
- Automatically migrate environment variables (change VUE_APP_ prefixes to VITE_)
- Automatically add appropriate Vite config
- Automatically move index.html and replace Webpack-related code in it (may require some manual work after)

## Installation

To install vue-migrate, simply run the following command:

```bash
npm install -g vue-migrate
```

## Usage

To migrate a project, navigate to the root directory of your Vue2 project and run the following command:

```bash
vue-migrate
```

or if you don't want to install it globally, run in the root of your project (where your `package.json` is located):

```bash
npx vue-migrate
```

The migration process will begin, and you will be prompted to choose the migration path you want to follow:

- Vue 2 with Vue CLI -> Vue 2 + Vite
- Vue 2 with Vue CLI -> Vue 3 Migration build + Vite
- Vue 2 with Vue CLI -> Vue 3 + Vite

Simply select the desired option, answer few questions and vue-migrate will take care of the rest.

## Configuration

The vue-migrate package automatically handles the creation and modification of necessary configuration files. However,
if you need to make additional changes, you can find the generated vite.config.js file in your project root directory
after migration.

## Troubleshooting

If you encounter any issues during the migration process, please refer to the Vue Migration Guide and Vite documentation
for further guidance.

## Contributing

If you would like to contribute to the development of `vue-migrate`, please feel free to submit a pull request on
the [GitHub repository](https://github.com/your-username/vue-migrate).

It would be great to have some help with the dictionary of old Vue 2 dependencies and their new Vue 3 equivalents.

## License

vue-migrate is released under the [MIT License](https://opensource.org/licenses/MIT).

## Changelog

For a detailed list of changes and improvements, please refer to the CHANGELOG file on GitHub.
