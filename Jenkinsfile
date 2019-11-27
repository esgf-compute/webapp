pipeline {
  agent {
    node {
      label 'jenkins-worker-builder'
    }

  }
  stages {
    stage('Build') {
      environment {
        JHOME = sh(script: 'pwd', , returnStdout: true).trim()
      }
      steps {
        sh 'echo "${JHOME}"'
      }
    }

  }
}