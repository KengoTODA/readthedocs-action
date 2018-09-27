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
