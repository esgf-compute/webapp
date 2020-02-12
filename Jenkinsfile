pipeline {
  agent none
  stages {
    stage('Build') {
      agent {
        node {
          label 'jenkins-buildkit'
        }

      }
      steps {
        container(name: 'buildkit', shell: '/bin/sh') {
          sh '''buildctl-daemonless.sh build \\
  --frontend dockerfile.v0 \\
  --local context=${PWD} \\
  --local dockerfile=${PWD} \\
  --output type=image,name=${OUTPUT_REGISTRY}/compute-webapp:${GIT_COMMIT:0:8},push=true \\
  --export-cache type=registry,ref=${OUTPUT_REGISTRY}/compute-webapp:cache \\
  --import-cache type=registry,ref=${OUTPUT_REGISTRY}/compute-webapp:cache'''
        }

      }
    }

    stage('Deploy') {
      agent {
        node {
          label 'jenkins-helm'
        }

      }
      when {
        branch 'devel'
      }
      environment {
        GH = credentials('ae3dd8dc-817a-409b-90b9-6459fb524afc')
      }
      steps {
        container(name: 'helm', shell: '/bin/bash') {
          sh '''#! /bin/bash

git clone -b devel https://github.com/esgf-compute/charts

cd charts/

conda install -c conda-forge ruamel.yaml

python scripts/update_config.py compute/values.yaml nginx ${GIT_COMMIT:0:8}

git config user.email ${GIT_EMAIL}

git config user.name ${GIT_NAME}

git add compute/values.yaml

git commit -m "Updates imageTag to ${GIT_COMMIT:0:8}"

git push https://${GH_USR}:${GH_PSW}@github.com/esgf-compute/charts'''
        }

      }
    }

  }
}