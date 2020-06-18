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

TAG=${GIT_COMMIT:0:8}

make webapp \\
 REGISTRY=${OUTPUT_REGISTRY} \\
 TAG=${TAG}

echo -e "webapp:\\n  imageTag: ${TAG}\\n" > update_webapp.yaml'''
          stash(name: 'update_webapp.yaml', includes: 'update_webapp.yaml')
        }

      }
    }

    stage('Deploy Dev') {
      agent {
        node {
          label 'jenkins-helm'
        }

      }
      steps {
        container(name: 'helm', shell: '/bin/bash') {
          ws(dir: 'work') {
            unstash 'update_webapp.yaml'
            sh '''#! /bin/bash

git clone https://github.com/esgf-compute/charts

HELM_ARGS="--reuse-values -f update_webapp.yaml --wait --timeout 2m"

helm3 upgrade ${DEV_RELEASE_NAME} charts/compute ${HELM_ARGS} | exit 0

helm3 status ${DEV_RELEASE_NAME}'''
          }

        }

      }
    }

  }
}