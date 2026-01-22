pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        IMAGE_NAME     = "mohammadkasim/cicd-demo"
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
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    '''
                }
            }
        }

        stage('Build Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }

        stage('Push Image') {
            steps {
                sh "docker push ${IMAGE_NAME}"
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                    docker run -d -p 8081:80 --name ${CONTAINER_NAME} ${IMAGE_NAME}
                '''
            }
        }
    }

    post {

    always {
        emailext(
            mimeType: 'text/html',
            subject: "📦 Jenkins Build: ${env.JOB_NAME} #${env.BUILD_NUMBER} — ${currentBuild.currentResult}",
            body: """
                <h2>Jenkins Pipeline Notification</h2>
                <p><b>Job:</b> ${env.JOB_NAME}</p>
                <p><b>Build Number:</b> ${env.BUILD_NUMBER}</p>
                <p><b>Status:</b> ${currentBuild.currentResult}</p>
                <p><b>Build URL:</b>
                   <a href="${env.BUILD_URL}">${env.BUILD_URL}</a>
                </p>
            """,
            to: "4king2will@gmail.com"
        )
    }

    failure {
        emailext(
            mimeType: 'text/html',
            subject: "❌ Jenkins FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            body: "Build failed. Check logs: ${env.BUILD_URL}console",
            to: "4king2will@gmail.com"
        )
    }
}

