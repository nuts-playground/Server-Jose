node {
    stage('Clone repository') {
        checkout scm
    }
    stage('Build image') {
        app = docker.build('kiyoung92/nestjs')
    }
    stage('Deploy') {
        steps {
            sh 'docker run --name nest-server -d -p 3000:3000 kiyoung92/nestjs:latest'
        }
    }
    // stage('Push image') {
    //     docker.withRegistry('https://registry.hub.docker.com', 'docker-hub') {
    //         app.push('${env.BUILD_NUMBER}')
    //         app.push('latest')
    //     }
    // }
 }