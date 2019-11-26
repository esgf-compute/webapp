pipeline {
  agent {
    node {
      label 'jenkins-worker-builder'
    }

  }
  stages {
    stage('Build') {
      steps {
        container(name: 'buildkit', shell: '/bin/sh')
        sh 'echo "HELLO"'
      }
    }

  }
}