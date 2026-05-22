pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-1"
        AWS_ACCOUNT_ID = "YOUR_AWS_ACCOUNT_ID"

        BACKEND_IMAGE = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/backend-app"
        FRONTEND_IMAGE = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/frontend-app"

        KUBE_NAMESPACE = "default"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                credentialsId: 'git-token',
                url: 'https://github.com/Avenis3010/three-tier-eks-cluster.git'
            }
        }

        stage('Login to ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region $AWS_REGION \
                | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
                '''
            }
        }

        stage('Build & Push Backend (Kaniko)') {
            steps {
                sh '''
cat <<EOF > /kaniko/.docker/config.json
{
  "credsStore": ""
}
EOF

/kaniko/executor \
--context=$WORKSPACE/backend \
--dockerfile=$WORKSPACE/backend/Dockerfile \
--destination=$BACKEND_IMAGE:latest
'''
            }
        }

        stage('Build & Push Frontend (Kaniko)') {
            steps {
                sh '''
/kaniko/executor \
--context=$WORKSPACE/frontend \
--dockerfile=$WORKSPACE/frontend/Dockerfile \
--destination=$FRONTEND_IMAGE:latest
'''
            }
        }

        stage('Deploy to EKS') {
            steps {
                sh '''
kubectl apply -f k8s/backend-deployment.yaml -n $KUBE_NAMESPACE
kubectl apply -f k8s/frontend-deployment.yaml -n $KUBE_NAMESPACE
kubectl rollout restart deployment backend -n $KUBE_NAMESPACE
kubectl rollout restart deployment frontend -n $KUBE_NAMESPACE
'''
            }
        }
    }

    post {
        success {
            echo "Pipeline executed successfully 🚀"
        }
        failure {
            echo "Pipeline failed ❌"
        }
    }
}
