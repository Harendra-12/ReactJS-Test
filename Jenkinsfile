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

        stage('Deploy on Webserver') {
            steps {
                sshPublisher(publishers: [
                    sshPublisherDesc(
                        configName: "${SSH_SERVER}",
                        transfers: [],
                        verbose: true,
                        execCommand: """
                            cd ${REMOTE_DIR} && \
                            docker load -i ${IMAGE_FILE} && \
                            docker rm -f react_app || true && \
                            docker run -d --name react_app -p 80:80 ${IMAGE_NAME}:${IMAGE_TAG}
                        """
                    )
                ])
            }
        }
    }

    post {
        success {
            echo "✅ Docker container deployed successfully on ${SSH_SERVER} (port 80)"
        }
        failure {
            echo "❌ Pipeline failed. Check logs."
        }
    }
}
