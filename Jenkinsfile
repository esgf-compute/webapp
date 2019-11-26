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
  --frontend=dockerfile.v0 \\
  --local dockerfile=${PWD} \\
  --local context=${PWD} \\
  --opt build-arg="COMPUTE_API_VER=0." \\
  --opt build-arg="GIT_SHORT_COMMIT=${GIT_SHORT_COMMIT}" \\
  --import-cache type=registry,ref=aims2.llnl.gov/${IMAGE}:cache \\
  --export-cache type=registry,ref=aims2.llnl.gov/${IMAGE}:cache \\
  --output type=image,name=aims2.llnl.gov/${IMAGE}:${GIT_SHORT_COMMIT},push=true'''
        }

      }
    }

  }
}