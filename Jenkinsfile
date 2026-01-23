pipeline {
    agent any

    environment {
        IMAGE_NAME     = "mohammadkasim/cicd-demo"
        CONTAINER_NAME = "cicd-demo-app"
    }

    stages {
        
        stage('Build Image') {
            steps {
                sh "docker build -t $IMAGE_NAME ."
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

    post {
    success {
        script {
            try {
                mail to: 'bobmarley.farzi@gmail.com',
                     subject: "✅ Jenkins Build SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                     body: "Build Successful! Job: ${env.JOB_NAME}, Build: #${env.BUILD_NUMBER}, URL: ${env.BUILD_URL}"
                echo "Success email sent successfully"
            } catch (Exception e) {
                echo "Failed to send success email: ${e.getMessage()}"
            }
        }
    }

    failure {
        script {
            try {
                mail to: 'bobmarley.farzi@gmail.com',
                     subject: "❌ Jenkins Build FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                     body: "Build Failed! Job: ${env.JOB_NAME}, Build: #${env.BUILD_NUMBER}, Logs: ${env.BUILD_URL}console"
                echo "Failure email sent successfully"
            } catch (Exception e) {
                echo "Failed to send failure email: ${e.getMessage()}"
            }
        }
    }

    always {
        echo "Pipeline execution completed"
    }
 }
}