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

    stage('Notify') {
      agent {
        node {
          label 'jenkins-base'
        }

      }
      steps {
        sh 'export'
        slackSend()
      }
    }

  }
}