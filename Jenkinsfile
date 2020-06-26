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

echo -e "nginx:\\n  imageTag: ${TAG}\\n" > update_webapp.yaml'''
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
      when {
        branch 'devel'
      }
      environment {
        GH = credentials('ae3dd8dc-817a-409b-90b9-6459fb524afc')
      }
      steps {
        container(name: 'helm', shell: '/bin/bash') {
          ws(dir: 'work') {
            unstash 'update_webapp.yaml'
            sh '''#! /bin/bash

cat update_webapp.yaml

git clone https://github.com/esgf-compute/charts

HELM_ARGS="--reuse-values -f update_webapp.yaml --wait --timeout 2m"

helm upgrade ${DEV_RELEASE_NAME} charts/compute ${HELM_ARGS} | exit 0

helm status ${DEV_RELEASE_NAME}'''
            sh '''#! /bin/bash


python charts/scripts/merge.py update_webapp.yaml charts/development.yaml

cd charts/

git status

git config user.email ${GIT_EMAIL}

git config user.name ${GIT_NAME}

git add development.yaml

git status

git commit -m "Updates image tag."

git push https://${GH_USR}:${GH_PSW}@github.com/esgf-compute/charts'''
            archiveArtifacts(artifacts: 'update_webapp.yaml', fingerprint: true, allowEmptyArchive: true)
          }

        }

      }
    }

    stage('Deploy Prod') {
      agent {
        node {
          label 'jenkins-helm'
        }

      }
      when {
        branch 'master'
      }
      environment {
        GH = credentials('ae3dd8dc-817a-409b-90b9-6459fb524afc')
      }
      steps {
        container(name: 'helm', shell: '/bin/bash') {
          ws(dir: 'work') {
            unstash 'update_webapp.yaml'
            sh '''#! /bin/bash

cat update_webapp.yaml

git clone https://github.com/esgf-compute/charts

HELM_ARGS="--reuse-values -f update_webapp.yaml --atomic"

helm upgrade ${PROD_RELEASE_NAME} charts/compute ${HELM_ARGS}

helm status ${PROD_RELEASE_NAME}'''
            sh '''#! /bin/bash


python charts/scripts/merge.py update_webapp.yaml charts/compute/values.yaml

cd charts/

git status

git config user.email ${GIT_EMAIL}

git config user.name ${GIT_NAME}

git add compute/values.yaml

git status

git commit -m "Updates image tag."

git push https://${GH_USR}:${GH_PSW}@github.com/esgf-compute/charts'''
            archiveArtifacts(artifacts: 'update_webapp.yaml', fingerprint: true, allowEmptyArchive: true)
          }

        }

      }
    }

  }
}