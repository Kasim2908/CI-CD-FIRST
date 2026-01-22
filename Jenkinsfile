pipeline {
    agent any

    environment {
        IMAGE_NAME = "mohammadkasim/cicd-demo"
        CONTAINER_NAME = "cicd-demo-app"
    }

    stages {

        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub-pass', variable: 'DOCKER_PASS')]) {
                    sh '''
                      echo "$DOCKER_PASS" | docker login -u mohammadkasim --password-stdin
                    '''
                }
            }
        }

        stage('Build Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Push Image') {
            steps {
                sh 'docker push $IMAGE_NAME'
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                  docker stop $CONTAINER_NAME || true
                  docker rm $CONTAINER_NAME || true
                  docker run -d -p 8081:80 --name $CONTAINER_NAME $IMAGE_NAME
                '''
            }
        }
    }
}
