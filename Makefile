.PHONY: watch test

watch:
	watchman watch shared
	watchman-make -p 'src/**/*.ts' -t all

test:
	echo 'hi'