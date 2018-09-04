# A GitHub Probot for Read The Docs (RTD) users

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Installation

1. invite `rtd-bot` user to your RTD project.
2. add `rtd.project` config to `.github/config.yml` file in your repo.
3. enable rtd-bot in your repo from the rtd-bot page (unpublished).

```yml
# sample .github/config.yml
rtd:
  project: your-read-the-docs-project
```

## Deployment

To run this bot on Heroku, you need to add a buildpack. See [puppeteer document](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-on-heroku) for detail.
