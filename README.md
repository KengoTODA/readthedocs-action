# A GitHub Probot for Read The Docs (RTD) users

[![Build Status](https://travis-ci.com/KengoTODA/rtd-bot.svg?branch=master)](https://travis-ci.com/KengoTODA/rtd-bot)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Installation

1. Invite `rtd-bot` user to your RTD project as maintainer.
2. Add `rtd.project` config to `.github/config.yml` file in your repo.
3. Enable rtd-bot in your repo from [the rtd-bot page at GitHub](https://github.com/apps/rtd-bot).

Here is a sample `.github/config.yml`:

```yml
rtd:
  project: your-read-the-docs-project
  language: en
```

## Deployment

In Read The Docs, __inviting maintainer means you give admin access__ to target account.
So if you do not want to invite `rtd-bot` as maintainer, you can host this Probot app by own.

To host this bot by own, you need to set following environment variables:

1. `RTD_USERNAME` that is same with user name of [Read The Docs](https://readthedocs.org/)
2. `RTD_PASSWORD` that is same with password of [Read The Docs](https://readthedocs.org/)
3. `WEBHOOK_SECRET` and `APP_ID` that is described at [Probot document](https://probot.github.io/docs/deployment/#deploy-the-app).
4. One of `PRIVATE_KEY_PATH` or `PRIVATE_KEY` that is described at [Probot document](https://probot.github.io/docs/deployment/#deploy-the-app).

To run this bot on Heroku, you need to add a buildpack. See [puppeteer document](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-on-heroku) for detail.

## License

Copyright 2018 Kengo TODA

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
