# 🚀 Jenkins CI/CD Pipeline with Docker & GitHub  
### (Including Email Notification Debug Notes)

---

## 📌 Project Overview

This repository demonstrates a complete **CI/CD pipeline** using:

- 🧩 Jenkins (running in Docker)
- 🐳 Docker
- 📦 Docker Hub
- 🐙 GitHub
- ☁️ AWS EC2 (Ubuntu)

The pipeline automatically:

- ✅ Triggers on GitHub push  
- ✅ Builds a Docker image  
- ✅ Pushes the image to Docker Hub  
- ✅ Deploys the container on EC2  
- ❌ Attempts to send email notifications (currently under debugging)

> 🎯 Core CI/CD pipeline works perfectly.  
> 📩 Email notification from pipeline is under investigation.

---

## 🛠 Tech Stack

| Category        | Tool |
|----------------|------|
| CI/CD          | Jenkins (Docker container) |
| Source Control | GitHub |
| Containers     | Docker |
| Registry       | Docker Hub |
| Cloud          | AWS EC2 (Ubuntu) |
| Notifications  | Jenkins Email Extension Plugin |

---

## 📂 Repository Structure

.
├── Dockerfile # Builds the Docker image for the application
│
├── Jenkinsfile # Defines the complete CI/CD pipeline stages
│
├── index.html # Simple demo web application
│
└── README.md # Project documentation and debugging notes





---

## 🔁 CI/CD Workflow

1. 📤 GitHub Push  
2. 🔔 Jenkins Webhook Trigger  
3. 📥 Checkout Source Code  
4. 🔐 Docker Login  
5. 🏗 Build Docker Image  
6. 📦 Push Image to Docker Hub  
7. 🚀 Deploy Container on EC2  
8. 📩 Email Notification (Attempted)


---

## 📜 Jenkinsfile (Pipeline Configuration)

```groovy
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

    post {
        success {
            emailext(
                subject: "✅ Jenkins Build SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                <h2>Build Successful 🎉</h2>
                <p><b>Job:</b> ${env.JOB_NAME}</p>
                <p><b>Build:</b> #${env.BUILD_NUMBER}</p>
                <p><b>URL:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                """,
                to: "your-email@example.com"
            )
        }

        failure {
            emailext(
                subject: "❌ Jenkins Build FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                <h2>Build Failed ❌</h2>
                <p><b>Job:</b> ${env.JOB_NAME}</p>
                <p><b>Build:</b> #${env.BUILD_NUMBER}</p>
                <p><b>Logs:</b> <a href="${env.BUILD_URL}console">${env.BUILD_URL}console</a></p>
                """,
                to: "your-email@example.com"
            )
        }
    }
}
