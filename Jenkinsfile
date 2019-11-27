pipeline {
  agent {
    node {
      label 'jenkins-worker-builder'
    }

  }
  stages {
    stage('Build') {
      agent {
        node {
          label 'jenkins-buildkit'
        }

      }
      steps {
        sh '''buildctl-daemonless.sh build \\
  --frontend=dockerfile.v0 \\
  --local context=${PWD} \\
  --local dockerfile=${PWD} \\
  --output type=image,name=${OUTPUT_REGISTRY}/webapp:${GIT_COMMIT:0:8},push=true'''
      }
    }

  }
}