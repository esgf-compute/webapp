pipeline {
  agent {
    node {
      label 'jenkins-worker-builder'
    }

  }
  stages {
    stage('Build') {
      environment {
        JHOME = sh(script: 'ls -la', , returnStatus: true)
      }
      steps {
        sh 'echo "${JHOME}"'
      }
    }

    stage('Optional') {
      when {
        environment name: 'JHOME', value: '1'
      }
      steps {
        sh 'echo "hello"'
      }
    }

  }
}