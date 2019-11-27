pipeline {
  agent {
    node {
      label 'jenkins-worker-builder'
    }

  }
  stages {
    stage('') {
      steps {
        sh 'git diff --name-only $GIT_PREVIOUS_COMMIT $GIT_COMMIT'
      }
    }

  }
}