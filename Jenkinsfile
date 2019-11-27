pipeline {
  agent {
    node {
      label 'jenkins-worker-builder'
    }

  }
  stages {
    stage('Build') {
      environment {
        JHOME = sh(script: 'ls -la', , returnStatus: true).trim()
      }
      steps {
        sh 'echo "${JHOME}"'
      }
    }

  }
}