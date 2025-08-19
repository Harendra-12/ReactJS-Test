pipeline {
    agent any

    environment {
        REPO_URL   = "https://github.com/Harendra-12/ReactJS-Test.git"
        BRANCH     = "main"
        SSH_SERVER = "Webserver"              // Jenkins SSH server config name
        REMOTE_DIR = "/Webserver/React"       // Directory on remote server
        IMAGE_NAME = "react_app"
        IMAGE_TAG  = "latest"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: "${BRANCH}", url: "${REPO_URL}"
            }
        }

        stage('Transfer Dockerfile') {
            steps {
                sshPublisher(publishers: [
                    sshPublisherDesc(
                        configName: "${SSH_SERVER}",
                        transfers: [
                            sshTransfer(
                                sourceFiles: "Dockerfile",
                                remoteDirectory: "${REMOTE_DIR}",
                                flatten: true
                            )
                        ],
                        verbose: true
                    )
                ])
            }
        }

        stage('Build & Run Container') {
            steps {
                sshScript remote: "${SSH_SERVER}", script: """
                    cd ${REMOTE_DIR} && \
                    echo "👉 Building Docker image..." && \
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} . && \
                    echo "👉 Removing old container if exists..." && \
                    docker rm -f ${IMAGE_NAME} || true && \
                    echo "👉 Running new container on port 80..." && \
                    docker run -d --name ${IMAGE_NAME} -p 80:80 ${IMAGE_NAME}:${IMAGE_TAG}
                """
            }
        }
    }

    post {
        success {
            echo "✅ Frontend container is running on port 80 at ${SSH_SERVER}"
        }
        failure {
            echo "❌ Pipeline failed. Check logs."
        }
    }
}
