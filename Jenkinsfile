pipeline {
    stage('Clone repository') {
        steps {
            checkout scm
        }
    }
    stage('Build image') {
        steps {
            app = docker.build('kiyoung92/nestjs')
        }
    }
    stage('Deploy') {
        steps {
            sh 'docker run --name nest-server -d -p 3000:3000 kiyoung92/nestjs:latest'
        }

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