node {
    stage('Clone repository') {
        checkout scm
    }
    stage('Build image') {
        app = docker.build('kiyoung92/nestjs')
    }
    stage('Run Image') {
        sh 'docker run --name nest-server -d -p 3000:3000 kiyoung92/nestjs:latest'
    }
}