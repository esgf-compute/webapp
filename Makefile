.PHONY: webapp

TAG = $(shell git rev-parse --short HEAD)
IMAGE = $(if $(REGISTRY),$(REGISTRY)/)webapp

OUTPUT = --output type=image,name=$(IMAGE):$(TAG),push=true

CACHE = --export-cache type=local,dest=/cache,mode=max \
				--import-cache type=local,src=/cache

ifeq ($(shell which buildctl-daemonless.sh),)
BUILD = docker run -it --rm \
					--privileged \
					-v ${PWD}:/build -w /build \
					-v ${PWD}/cache:/cache \
					-v ${HOME}/.docker:/root/.docker \
					--entrypoint /bin/sh \
					moby/buildkit:master
endif

webapp:
	$(BUILD) build.sh . $(CACHE) $(OUTPUT)
