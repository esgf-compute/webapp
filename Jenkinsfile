pipeline {
  agent {
    node {
      label 'jenkins-worker-builder'
    }

  }
  stages {
    stage('Build') {
      steps {
        container(name: 'buildkit', shell: '/bin/sh') {
          catchError() {
            sh '''buildctl-daemonless.sh build \\
  --frontend dockerfile.v0 \\
  --local context=${PWD} \\
  --local dockerfile=${PWD} \\
  --output type=image,name=${OUTPUT_REGISTRY}/compute-webapp:${GIT_COMMIT:0:8},push=true'''
          }

        }

      }
    }

    stage('Notify') {
      steps {
        slackSend(message: 'Test env.currentBuild.result')
      }
    }

  }
}