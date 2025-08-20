pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID = "677276107791"
        AWS_REGION     = "us-east-2"
        REPO_NAME      = "ecr_repository"
        VERSION_TAG    = "${BUILD_NUMBER}"
        IMAGE_TAG      = "latest"   // You can change this to BUILD_NUMBER or git commit SHA
        ECR_URL        = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO_NAME}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Harendra-12/ReactJS-Test.git'
            }
        }

        stage('Build Image with Docker') {
            steps {
                sh "docker build --build-arg BUILD_NUMBER=${BUILD_NUMBER} -t ${REPO_NAME}:${IMAGE_TAG} ."
            }
        }

        stage('Login to ECR') {
            steps {
                withAWS(credentials: 'aws-creds', region: "${AWS_REGION}") {
                    sh '''
                    PASSWORD=$(aws ecr get-login-password --region us-east-2)
                    docker login --username AWS --password $PASSWORD 677276107791.dkr.ecr.us-east-2.amazonaws.com
                    '''
                }
            }
        }

        
        
        stage('Tag & Push Image to ECR') {
            steps {
                sh """
                docker tag ${REPO_NAME}:${IMAGE_TAG} ${ECR_URL}:${VERSION_TAG}
                docker push ${ECR_URL}:${VERSION_TAG}
                docker tag ${REPO_NAME}:${IMAGE_TAG} ${ECR_URL}:${IMAGE_TAG}
                docker push ${ECR_URL}:${IMAGE_TAG}
                """
            }
        }

        stage('Deploy to Webserver') {
            steps {
                script {
                    sh """
                    # Stream image directly to webserver’s Docker
                    docker save ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO_NAME}:${IMAGE_TAG} | \
                    bzip2 | ssh -o StrictHostKeyChecking=no root@18.223.151.223 'bunzip2 | docker load'

                    # Restart container on webserver
                    ssh -o StrictHostKeyChecking=no root@18.223.151.223 '
                        docker stop myapp || true &&
                        docker rm myapp || true &&
                        docker run -d --name myapp -p 80:80 ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO_NAME}:${IMAGE_TAG}
                    '
                    """
                    }
                }
            }
        }       
    
    post {
        success {
            echo "✅ Successfully pushed: ${ECR_URL}:${IMAGE_TAG}"
        }
        failure {
            echo "❌ Pipeline failed. Check logs."
        }
    }
}
