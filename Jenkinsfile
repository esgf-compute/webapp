pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        container(name: 'buildkit', shell: '/bin/sh')
        sh 'echo "HELLO"'
      }
    }

  }
}