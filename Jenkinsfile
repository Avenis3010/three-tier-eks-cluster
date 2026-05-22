pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-1"
        ECR_BACKEND = "758024567313.dkr.ecr.ap-south-1.amazonaws.com/backend-repo"
        ECR_FRONTEND = "758024567313.dkr.ecr.ap-south-1.amazonaws.com/frontend-repo"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/Avenis3010/three-tier-eks-cluster'
            }
        }

        stage('Docker Build Backend') {
            steps {
                dir('backend') {
                    sh 'docker build -t backend-app .'
                }
            }
        }

        stage('Docker Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'docker build -t frontend-app .'
                }
            }
        }

        stage('Login to ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region $AWS_REGION | \
                docker login --username AWS --password-stdin \
                758024567313.dkr.ecr.ap-south-1.amazonaws.com
                '''
            }
        }

        stage('Push Backend') {
            steps {
                sh '''
                docker tag backend-app:latest $ECR_BACKEND:latest
                docker push $ECR_BACKEND:latest
                '''
            }
        }

        stage('Push Frontend') {
            steps {
                sh '''
                docker tag frontend-app:latest $ECR_FRONTEND:latest
                docker push $ECR_FRONTEND:latest
                '''
            }
        }

        stage('Deploy to EKS') {
            steps {
                sh '''
                aws eks update-kubeconfig --region ap-south-1 --name three-tier-cluster

                kubectl apply -f k8s/
                kubectl rollout restart deployment backend -n three-tier
                kubectl rollout restart deployment frontend -n three-tier
                '''
            }
        }
    }
}
