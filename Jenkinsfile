// node {
//     stage('Clone repository') {
//         checkout scm
//     }
//     stage('Build image') {
//         app = docker.build('kiyoung92/nestjs')
//     }
    
// }

pipeline {
    stages {
        stage('Clone Repo') {
            steps {
                checkout scm
            }
        }
        stage('Build Image') {
            steps {
                app = docker.build('kiyoung92/nestjs')
            }
        }
        stage('Deploy') {
            sh 'docker run --name nest-server -d -p 3000:3000 kiyoung92/nestjs:latest'

            post {
                success {
                    echo 'docker run success'
                }
                failure {
                    echo 'docker run failed'
                }
            }
        }
    }
}