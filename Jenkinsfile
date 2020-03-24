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
          sh '''#! /bin/sh 

make webapp REGISTRY=${OUTPUT_REGISTRY}'''
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

GIT_COMMIT="$(git rev-parse --short HEAD)"

git clone -b devel https://github.com/esgf-compute/charts

cd charts/

python scripts/update_config.py compute/values.yaml nginx ${GIT_COMMIT}

git config user.email ${GIT_EMAIL}

git config user.name ${GIT_NAME}

git add compute/values.yaml

git commit -m "Updates imageTag to ${GIT_COMMIT}"

git push https://${GH_USR}:${GH_PSW}@github.com/esgf-compute/charts'''
        }

      }
    }

  }
}