pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-1"
        AWS_ACCOUNT_ID = "758024567313"

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

        stage('Configure AWS Credentials') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
                    sh '''
                    aws sts get-caller-identity
                    '''
                }
            }
        }

       stage('Build Backend') {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:latest
    command:
    - sleep
    args:
    - 999999
    volumeMounts:
    - name: docker-config
      mountPath: /kaniko/.docker
  volumes:
  - name: docker-config
    emptyDir: {}
'''
        }
    }

    steps {
        container('kaniko') {
            sh '''
            /kaniko/executor \
            --dockerfile=backend/Dockerfile \
            --context=$WORKSPACE/backend \
            --destination=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/backend-app:latest
            '''
        }
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
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
                    sh '''
aws eks update-kubeconfig --name YOUR_EKS_CLUSTER --region $AWS_REGION

kubectl apply -f k8s/backend-deployment.yaml -n $KUBE_NAMESPACE
kubectl apply -f k8s/frontend-deployment.yaml -n $KUBE_NAMESPACE

kubectl rollout restart deployment backend -n $KUBE_NAMESPACE
kubectl rollout restart deployment frontend -n $KUBE_NAMESPACE
'''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline executed successfully"
        }
        failure {
            echo "❌ Pipeline failed"
        }
    }
}
