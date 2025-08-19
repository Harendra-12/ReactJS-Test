pipeline {
    agent any

    environment {
        REPO_URL   = "https://github.com/Harendra-12/ReactJS-Test.git"
        BRANCH     = "main"
        SSH_SERVER = "Webserver"
        REMOTE_DIR = "/Webserver/React"
        IMAGE_NAME = "react_app"
        IMAGE_TAG  = "latest"
        IMAGE_FILE = "react_app.tar"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: "${BRANCH}", url: "${REPO_URL}"
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                sh "docker save -o ${IMAGE_FILE} ${IMAGE_NAME}:${IMAGE_TAG}"
            }
        }
        
        stage('Clean Docker Storage') {
            steps {
                echo "🧹 Cleaning up unused Docker images, containers, volumes, and build cache..."
                sh '''
                    docker system prune -af --volumes
                    docker builder prune -af
                '''
            }
        }

        stage('Transfer Docker Image to Webserver') {
            steps {
                sshPublisher(publishers: [
                    sshPublisherDesc(
                        configName: "${SSH_SERVER}",
                        transfers: [
                            sshTransfer(
                                sourceFiles: "${IMAGE_FILE}",
                                remoteDirectory: "${REMOTE_DIR}",
                                flatten: true
                            )
                        ],
                        verbose: true
                    )
                ])
            }
        }
    }

    post {
        success {
            echo "✅ Docker image transferred successfully to ${SSH_SERVER}:${REMOTE_DIR}"
        }
        failure {
            echo "❌ Pipeline failed. Check logs."
        }
    }
}
