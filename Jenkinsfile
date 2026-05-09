pipeline {
agent any

environment {
    BACKEND_IMAGE = "aalokumar01/dev-clustra-backend:${BUILD_NUMBER}"
    EC2_HOST = "13.233.108.144"
}

stages {



    stage('Build Backend Docker Image') {
        steps {
            sh '''
            docker build -t $BACKEND_IMAGE ./backend
            '''
        }
    }

    stage('DockerHub Login') {
        steps {
            withCredentials([usernamePassword(
                credentialsId: 'dockerhub-creds',
                usernameVariable: 'DOCKER_USER',
                passwordVariable: 'DOCKER_PASS'
            )]) {

                sh '''
                echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                '''
            }
        }
    }

    stage('Push Backend Image') {
        steps {
            sh '''
            docker push $BACKEND_IMAGE
            '''
        }
    }

    stage('Deploy To Production EC2') {
        steps {
            sh """
            ssh ubuntu@$EC2_HOST '
                cd ~/devclustra && \
                sed -i "s|image: .*|image: $BACKEND_IMAGE|" docker-compose.yml && \
                docker compose pull && \
                docker compose up -d
            '
            """
        }
    }

}

post {

    success {
        echo 'Production deployment completed successfully!'
    }

    failure {
        echo 'Pipeline failed!'
    }

}

}
