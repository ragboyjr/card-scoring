.PHONY: build pack watch

build:
	npm run build

pack:
	npm pack
	cd ../mobile && npm install ../shared/card-scoring-shared-*.tgz
	cd ../web && npm install ../shared/card-scoring-shared-*.tgz

watch:
	watchman-make -p 'src/**/*.ts' 'package.json' -t build pack