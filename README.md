# Get URL of staging document, when you review changes.

![](https://github.com/KengoTODA/rtd-bot/workflows/.github/workflows/build.yml/badge.svg)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Work with Read the Docs, then you'll find that PR for documentation needs additional steps like:

* running RTD build for your branch manually, to use its result as staging site [like this](https://github.com/spotbugs/spotbugs/pull/697#issue-201455071), or
* sharing screenshot to share the updated document [like this](https://github.com/spotbugs/spotbugs/pull/718#issue-205904835).

This bot automates the first approach; activate RTD build automatically when you made PR that updates `docs/` directory.

![screenshot](screenshot.png)

## How to use

You have three ways to use this service:

1. Use as a SaaS
2. Use as a step in GitHub Action
3. Host own service

### Initial setup

No matter which way you choose, follow the following interactions:

0. Make sure that your RTD project has been [connected with GitHub repository](https://docs.readthedocs.io/en/latest/getting_started.html#sign-up-and-connect-an-external-account), or [integrated via GitHub webhook](https://docs.readthedocs.io/en/latest/webhooks.html#github).
1. Add `rtd.project` config to the `.github/config.yml` file in your repo.

Here is a sample `.github/config.yml`:

```yml
rtd:
  project: your-read-the-docs-project
```

### 1. Use as a SaaS

In Read the Docs, __inviting maintainer means you give admin access__ to target account.
So if you do not want to invite `rtd-bot` as maintainer, use other way instead of this way.

To enable rtd-bot SaaS for your GitHub repository, follow the following interactions:

1. Invite `rtd-bot` user to your RTD project as maintainer.
2. Enable rtd-bot in your repo from [the rtd-bot page at GitHub](https://github.com/apps/rtd-helper).

### 2. Use as a step in GitHub Action

To use in GitHub Action, use the tag with `actions-` prefix. The commit includes files in `lib` and `node_modules` directories.

You need to set three environment variables: `RTD_USERNAME`, `RTD_PASSWORD` and `GITHUB_TOKEN`. See the next section for detail.

```yml
on:
  [pull_request]
...
steps:
  ...
  - name: Build staging document
    uses: KengoTODA/rtd-bot@actions-v0.8.1
    env:
      RTD_USERNAME: your_rtd_username
      RTD_PASSWORD: ${{ secrets.RTD_PASSWORD }}
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 3. Host own service

To host this bot by own, you need to set following environment variables:

1. `RTD_USERNAME` that is same with user name of [Read the Docs](https://readthedocs.org/)
2. `RTD_PASSWORD` that is same with password of [Read the Docs](https://readthedocs.org/)
3. `WEBHOOK_SECRET` and `APP_ID` that is described at [Probot document](https://probot.github.io/docs/deployment/#deploy-the-app).
4. One of `PRIVATE_KEY_PATH` or `PRIVATE_KEY` that is described at [Probot document](https://probot.github.io/docs/deployment/#deploy-the-app).

To run this bot on Heroku, you need to add a buildpack. See [puppeteer document](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-on-heroku) for detail.

## Advanced Configuration

### Configuration for the project with translations

If you use [translations feature](https://docs.readthedocs.io/en/latest/localization.html#project-with-multiple-translations), make sure you've configured all your RTD projects including translations.

In `.github/config.yml` file, set the project slug of the root RTD project.

## License

Copyright &copy; 2018-2020 Kengo TODA

```
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

The RTD Helper's avatar is designed by [MAM2](https://dribbble.com/MAM2).
