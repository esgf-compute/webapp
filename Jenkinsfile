pipeline {
  agent none
  stages {
    stage('Build') {
      steps {
        container(name: 'buildkit', shell: '/bin/sh')
      }
    }

  }
}