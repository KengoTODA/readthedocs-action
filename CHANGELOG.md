## [0.8.3](https://github.com/KengoTODA/rtd-bot/compare/v0.8.2...v0.8.3) (2020-02-13)


### Bug Fixes

* GitHub Actions should have dev-deps in node_modules ([7f22d2a](https://github.com/KengoTODA/rtd-bot/commit/7f22d2ac91711853269831c1a9cb5e9c073191d5))
* use import instead of require() ([caefdfb](https://github.com/KengoTODA/rtd-bot/commit/caefdfb7fec19272e2317e93e5a46a273b05881b))

## [0.8.3](https://github.com/KengoTODA/rtd-bot/compare/v0.8.2...v0.8.3) (2020-02-13)


### Bug Fixes

* use import instead of require() ([caefdfb](https://github.com/KengoTODA/rtd-bot/commit/caefdfb7fec19272e2317e93e5a46a273b05881b))

## [0.8.2](https://github.com/KengoTODA/rtd-bot/compare/v0.8.1...v0.8.2) (2020-02-13)


### Bug Fixes

* unexpected compilation error for GitHub Actions ([614a8e1](https://github.com/KengoTODA/rtd-bot/commit/614a8e188946a830548c825219406e83fb2fd29f))

## [0.8.1](https://github.com/KengoTODA/rtd-bot/compare/v0.8.0...v0.8.1) (2020-02-13)


### Bug Fixes

* skip build by semantic-release ([7a6fb9d](https://github.com/KengoTODA/rtd-bot/commit/7a6fb9d83f4d99eb81c6bb3911527658d647cfe8))

# [0.8.0](https://github.com/KengoTODA/rtd-bot/compare/v0.7.3...v0.8.0) (2020-02-13)


### Features

* support working as GitHub Actions ([a671966](https://github.com/KengoTODA/rtd-bot/commit/a671966c0ec176bda35b75f05e6aef14a4fae8d5))

## [0.7.3](https://github.com/KengoTODA/rtd-bot/compare/v0.7.2...v0.7.3) (2019-07-16)


### Bug Fixes

* upgrade lodash to fix CVE-2019-10744 ([59ec914](https://github.com/KengoTODA/rtd-bot/commit/59ec914))

## [0.7.2](https://github.com/KengoTODA/rtd-bot/compare/v0.7.1...v0.7.2) (2019-03-13)


### Bug Fixes

* Solve probot issue 888 ([#145](https://github.com/KengoTODA/rtd-bot/issues/145)) ([a0afc71](https://github.com/KengoTODA/rtd-bot/commit/a0afc71))

## [0.7.1](https://github.com/KengoTODA/rtd-bot/compare/v0.7.0...v0.7.1) (2019-03-09)


### Bug Fixes

* replace old API with new pagenation API ([df0bc49](https://github.com/KengoTODA/rtd-bot/commit/df0bc49))

# [0.7.0](https://github.com/KengoTODA/rtd-bot/compare/v0.6.2...v0.7.0) (2019-02-01)


### Features

* add an avatar designed by MAM2 ([de96544](https://github.com/KengoTODA/rtd-bot/commit/de96544))

## [0.6.2](https://github.com/KengoTODA/rtd-bot/compare/v0.6.1...v0.6.2) (2019-01-14)


### Bug Fixes

* Consider null-ability of HEAD branch ([b44b8b5](https://github.com/KengoTODA/rtd-bot/commit/b44b8b5)), closes [#78](https://github.com/KengoTODA/rtd-bot/issues/78)

## [0.6.1](https://github.com/KengoTODA/rtd-bot/compare/v0.6.0...v0.6.1) (2019-01-14)


### Bug Fixes

* Skip operation if the target PR is already closed ([2601e02](https://github.com/KengoTODA/rtd-bot/commit/2601e02)), closes [#107](https://github.com/KengoTODA/rtd-bot/issues/107)

# [0.6.0](https://github.com/KengoTODA/rtd-bot/compare/v0.5.3...v0.6.0) (2018-12-03)


### Features

* disable RTD build when PR is closed/merged ([04c15bc](https://github.com/KengoTODA/rtd-bot/commit/04c15bc))

## [0.5.3](https://github.com/KengoTODA/rtd-bot/compare/v0.5.2...v0.5.3) (2018-12-03)


### Bug Fixes

* Add a RTD badge to make build progress visual in PR page ([9ac6b0b](https://github.com/KengoTODA/rtd-bot/commit/9ac6b0b))

## [0.5.2](https://github.com/KengoTODA/rtd-bot/compare/v0.5.1...v0.5.2) (2018-10-19)


### Bug Fixes

* Stop adding document URL multiple times ([1a12683](https://github.com/KengoTODA/rtd-bot/commit/1a12683))

## [0.5.1](https://github.com/KengoTODA/rtd-bot/compare/v0.5.0...v0.5.1) (2018-10-16)


### Bug Fixes

* remove needless flag to launch Chrome ([1851061](https://github.com/KengoTODA/rtd-bot/commit/1851061)), closes [jontewks/puppeteer-heroku-buildpack#15](https://github.com/jontewks/puppeteer-heroku-buildpack/issues/15)

# [0.5.0](https://github.com/KengoTODA/rtd-bot/compare/v0.4.1...v0.5.0) (2018-10-09)


### Bug Fixes

* Introduce retry to avoid "WebSocket is not open: readyState 3 (CLOSED)" error ([19f75bf](https://github.com/KengoTODA/rtd-bot/commit/19f75bf))
* retry launching browser several times ([da97395](https://github.com/KengoTODA/rtd-bot/commit/da97395))


### Features

* let rtd-bot reports problems at the target PR ([7a1195b](https://github.com/KengoTODA/rtd-bot/commit/7a1195b))

## [0.4.1](https://github.com/KengoTODA/rtd-bot/compare/v0.4.0...v0.4.1) (2018-09-27)


### Bug Fixes

* explicitly decrare the type parameter of context.config() ([56ec49a](https://github.com/KengoTODA/rtd-bot/commit/56ec49a))

# [0.4.0](https://github.com/KengoTODA/rtd-bot/compare/v0.3.2...v0.4.0) (2018-09-18)


### Bug Fixes

* make error message around config more intuitive ([88195f3](https://github.com/KengoTODA/rtd-bot/commit/88195f3))


### Features

* add a method to get numeric project ID via official WebAPI ([ec3d3db](https://github.com/KengoTODA/rtd-bot/commit/ec3d3db))
* Add a method to load all configured languages ([56f74f4](https://github.com/KengoTODA/rtd-bot/commit/56f74f4))
* add current config into report to end users ([f234f98](https://github.com/KengoTODA/rtd-bot/commit/f234f98))
* display multiple URLs when project uses translations ([dc6a004](https://github.com/KengoTODA/rtd-bot/commit/dc6a004))
* enable build for all translations at once ([9eaf4a0](https://github.com/KengoTODA/rtd-bot/commit/9eaf4a0))
* introduce retry ([992be29](https://github.com/KengoTODA/rtd-bot/commit/992be29))

## [0.3.2](https://github.com/KengoTODA/rtd-bot/compare/v0.3.1...v0.3.2) (2018-09-10)


### Bug Fixes

* use proper payload instead of missing issue payload ([a7dfb6b](https://github.com/KengoTODA/rtd-bot/commit/a7dfb6b))

## [0.3.1](https://github.com/KengoTODA/rtd-bot/compare/v0.3.0...v0.3.1) (2018-09-10)


### Bug Fixes

* Fix a typo ([b0e8782](https://github.com/KengoTODA/rtd-bot/commit/b0e8782))
* make edited commit intuitive, by adding a HTML comment ([1f56216](https://github.com/KengoTODA/rtd-bot/commit/1f56216))

# [0.3.0](https://github.com/KengoTODA/rtd-bot/compare/v0.2.2...v0.3.0) (2018-09-10)


### Bug Fixes

* Escape branch name that contains / in its name ([9373657](https://github.com/KengoTODA/rtd-bot/commit/9373657))
* language should not be undefined ([a2dc7c2](https://github.com/KengoTODA/rtd-bot/commit/a2dc7c2))


### Features

* Add RTD URL into not comment but the PR body ([c205693](https://github.com/KengoTODA/rtd-bot/commit/c205693))

## [0.2.2](https://github.com/KengoTODA/rtd-bot/compare/v0.2.1...v0.2.2) (2018-09-07)


### Bug Fixes

* Add more log around GitHub collaboration for debugging ([2407248](https://github.com/KengoTODA/rtd-bot/commit/2407248))
* **src/rtd.ts:** Wait until navigation is finished ([a791ace](https://github.com/KengoTODA/rtd-bot/commit/a791ace))

## [0.2.1](https://github.com/KengoTODA/rtd-bot/compare/v0.2.0...v0.2.1) (2018-09-04)


### Bug Fixes

* **index.js:** fix ReferenceError ([ba267ab](https://github.com/KengoTODA/rtd-bot/commit/ba267ab))

# [0.2.0](https://github.com/KengoTODA/rtd-bot/compare/v0.1.0...v0.2.0) (2018-09-04)


### Features

* **index.js:** Make language configurable ([02cc880](https://github.com/KengoTODA/rtd-bot/commit/02cc880))
* **index.js:** Skip check if PR comes from another GitHub repo ([0a2229e](https://github.com/KengoTODA/rtd-bot/commit/0a2229e))

# 0.1.0 (2018-09-04)


### Bug Fixes

* use async function to call another async funcs with await ([e5f59bb](https://github.com/KengoTODA/rtd-bot/commit/e5f59bb))
