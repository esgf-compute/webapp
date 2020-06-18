pipeline {
  agent none
  stages {
    stage('Build') {
      agent {
        node {
          label 'jenkins-buildkit'
        }

      }
      steps {
        container(name: 'buildkit', shell: '/bin/sh') {
          sh '''#! /bin/sh 

make webapp REGISTRY=${OUTPUT_REGISTRY}'''
        }

      }
    }

  }
}