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
          sh '''buildctl-daemonless.sh build \\
  --frontend dockerfile.v0 \\
  --local context=${PWD} \\
  --local dockerfile=${PWD}'''
        }

      }
    }

  }
}