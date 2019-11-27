pipeline {
  agent {
    node {
      label 'jenkins-worker-builder'
    }

  }
  stages {
    stage('error') {
      steps {
        sh 'git diff --name-only $GIT_PREVIOUS_COMMIT $GIT_COMMIT'
        script {
          for (changeLogSet in currentBuild.changeSets) {
            for (entry in changeLogSet.getItems()) { // for each commit in the detected changes
            for (file in entry.getAffectedFiles()) {
              println file.getPath() // add changed file to list
            }
          }
        }
      }

    }
  }

}
}