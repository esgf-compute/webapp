.PHONY: webapp

CACHE_PATH ?= $(PWD)/cache

GIT_BRANCH := $(shell git rev-parse --abbrev-ref HEAD)
GIT_COMMIT := $(shell git rev-parse --short HEAD)
VERSION := $(shell cat VERSION)

IMAGE := $(if $(REGISTRY),$(REGISTRY)/)compute-webapp
TAG := $(or $(if $(findstring $(GIT_BRANCH),master),$(VERSION)), $(VERSION)_$(GIT_BRANCH)_$(GIT_COMMIT))

OUTPUT := --output type=image,name=$(IMAGE):$(TAG),push=true

CACHE := --export-cache type=local,dest=$(CACHE_PATH),mode=max \
				--import-cache type=local,src=$(CACHE_PATH)

ifeq ($(shell which buildctl-daemonless.sh),)
BUILD = docker run -it --rm \
					--privileged \
					-v ${PWD}:/build -w /build \
					-v ${HOME}/.docker:/root/.docker \
					--entrypoint /bin/sh \
					moby/buildkit:master
else
BUILD = $(SHELL)
endif

webapp:
	$(BUILD) build.sh . $(CACHE) $(OUTPUT)

	echo -e "nginx:\n  imageTag: $(TAG)" > update_webapp.yaml
