🚀 Jenkins CI/CD Pipeline with Docker & GitHub
(Including Email Notification Debug Notes)
📌 Project Overview

This repository demonstrates a complete CI/CD pipeline using Jenkins, Docker, GitHub, and Docker Hub, deployed on an AWS EC2 (Ubuntu) instance.

The pipeline automatically:

Triggers on GitHub push

Builds a Docker image

Pushes the image to Docker Hub

Deploys the container on EC2

(Attempts) to send email notifications on build success/failure

✅ Core CI/CD pipeline works perfectly
❌ Email notification via pipeline does not trigger (manual test mail works)

🛠️ Tech Stack
Category	Tool
CI/CD	Jenkins (Docker container)
SCM	GitHub
Containers	Docker
Registry	Docker Hub
Cloud	AWS EC2 (Ubuntu)
Notifications	Jenkins Email Extension Plugin
📂 Repository Structure
.
├── Dockerfile
├── Jenkinsfile
├── index.html
└── README.md

🔁 CI/CD Workflow
GitHub Push
   ↓
Jenkins Webhook Trigger
   ↓
Checkout Source Code
   ↓
Docker Login
   ↓
Docker Build
   ↓
Docker Push
   ↓
Run Container on EC2
   ↓
(Attempted) Email Notification

📜 Jenkinsfile (Current)
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
                to: "4king2will@gmail.com"
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
                to: "4king2will@gmail.com"
            )
        }
    }
}

✅ What Works Successfully

✅ GitHub webhook triggers Jenkins automatically

✅ Pipeline starts on every push

✅ Docker login via Jenkins credentials works

✅ Docker image builds successfully

✅ Image pushes to Docker Hub

✅ Container runs on EC2 (http://<EC2-IP>:8081)

✅ Jenkins Test Email works from system configuration

❌ Known Issue: Email Notification from Pipeline
🔴 Problem Description

Although Jenkins email configuration is correct and test emails are received, emails are NOT sent when the pipeline completes (success or failure).

🔍 Observed Behavior
Action	Result
Jenkins test email	✅ Received
Pipeline success email	❌ Not received
Pipeline failure email	❌ Not received
Console error	❌ No visible error
🧠 Suspected Root Causes

This issue likely relates to one or more of the following:

Email Extension Plugin context issue

Plugin works globally but not inside post {} block

Jenkins running inside Docker

Possible isolation between Jenkins runtime and SMTP execution

Script Security / Sandbox

emailext step may require additional approval

Recipient configuration

May require recipientProviders instead of static to

Silent failure in post block

No error logged even though email not sent

🔍 Debugging Already Done

✔ SMTP configured correctly (Gmail App Password)

✔ Email Extension Plugin installed

✔ Test mail works consistently

✔ Jenkinsfile syntax validated

✔ Declarative pipeline (not scripted)

✔ No Groovy or runtime errors in console

🆘 Help Needed

Looking for help from an experienced DevOps engineer to:

Identify why emailext does not trigger in post block

Suggest correct configuration for email notifications

Confirm if this is a known Jenkins-Docker limitation

Recommend a better notification approach if required

📌 Notes

Jenkins runs inside Docker

Docker socket mounted: /var/run/docker.sock

Jenkins home persisted via volume

EC2 security groups configured correctly

✨ Final Status

✅ CI/CD pipeline fully functional
❌ Email automation pending fix
