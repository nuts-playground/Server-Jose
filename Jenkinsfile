node {
    stage("Clone repository") {
        checkout scm
    }
    stage("Build image") {
        app = docker.build("nestjs")
    }
    // stage("Docker Run") {
    //     steps {
    //         docker run --name NestJS -p 3000:3001 -p 40000:3000 -u root Nestjs
    //     }
    // }
 }