# Get URL of staging document, when you review changes.

![](https://github.com/KengoTODA/rtd-bot/workflows/.github/workflows/build.yml/badge.svg)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Work with Read the Docs, then you'll find that PR for documentation needs additional steps like:

* running RTD build for your branch manually, to use its result as staging site [like this](https://github.com/spotbugs/spotbugs/pull/697#issue-201455071), or
* sharing screenshot to share the updated document [like this](https://github.com/spotbugs/spotbugs/pull/718#issue-205904835).

This bot automates the first approach; activate RTD build automatically when you made PR that updates `docs/` directory.

![screenshot](screenshot.png)

## Installation

To install rtd-bot to your GitHub repository, follow these interactions:

0. Make sure that your RTD project has been [connected with GitHub repository](https://docs.readthedocs.io/en/latest/getting_started.html#sign-up-and-connect-an-external-account), or [integrated via GitHub webhook](https://docs.readthedocs.io/en/latest/webhooks.html#github).
1. Invite `rtd-bot` user to your RTD project as maintainer.
2. Add `rtd.project` config to `.github/config.yml` file in your repo.
3. Enable rtd-bot in your repo from [the rtd-bot page at GitHub](https://github.com/apps/rtd-helper).

Here is a sample `.github/config.yml`:

```yml
rtd:
  project: your-read-the-docs-project
```

### Configuration for the project with translations

If you use [translations feature](https://docs.readthedocs.io/en/latest/localization.html#project-with-multiple-translations), make sure you've configured all your RTD projects including translations.

In `.github/config.yml` file, set the project slug of the root RTD project.

## Deployment

In Read the Docs, __inviting maintainer means you give admin access__ to target account.
So if you do not want to invite `rtd-bot` as maintainer, you can host this Probot app by own.

To host this bot by own, you need to set following environment variables:

1. `RTD_USERNAME` that is same with user name of [Read the Docs](https://readthedocs.org/)
2. `RTD_PASSWORD` that is same with password of [Read the Docs](https://readthedocs.org/)
3. `WEBHOOK_SECRET` and `APP_ID` that is described at [Probot document](https://probot.github.io/docs/deployment/#deploy-the-app).
4. One of `PRIVATE_KEY_PATH` or `PRIVATE_KEY` that is described at [Probot document](https://probot.github.io/docs/deployment/#deploy-the-app).

To run this bot on Heroku, you need to add a buildpack. See [puppeteer document](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-on-heroku) for detail.

## License

Copyright &copy; 2018-2019 Kengo TODA

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
