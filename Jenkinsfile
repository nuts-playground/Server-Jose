node {
    stage('Clone repository') {
        checkout scm
    }
    stage('Build image') {
        app = docker.build('kiyoung92/nestjs')
    }
    stage('Run Image') {
        steps {
            docker 'run -p 3000:3000 nestjs'
        }
    }
    // stage('Push image') {
    //     docker.withRegistry('https://registry.hub.docker.com', 'docker-hub') {
    //         app.push('${env.BUILD_NUMBER}')
    //         app.push('latest')
    //     }
    // }
 }