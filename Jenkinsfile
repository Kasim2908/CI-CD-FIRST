pipeline {
    agent any

    environment {
        IMAGE_NAME = "mohammadkasim/cicd-demo"
        CONTAINER_NAME = "cicd-demo-app"
    }

    stages {

        stage('Docker Login') {
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
post {
    success {
        mail to: '4king2will@gmail.com',
             subject: "✅ SUCCESS: CI/CD Pipeline - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
             body: """
SUCCESS 🎉

Job: ${env.JOB_NAME}
Build Number: ${env.BUILD_NUMBER}
Status: SUCCESS

Check Jenkins:
${env.BUILD_URL}
"""
    }

    failure {
        mail to: '4king2will@gmail.com',
             subject: "❌ FAILED: CI/CD Pipeline - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
             body: """
FAILED ❌

Job: ${env.JOB_NAME}
Build Number: ${env.BUILD_NUMBER}
Status: FAILED

Check logs immediately:
${env.BUILD_URL}
"""
    }
}
