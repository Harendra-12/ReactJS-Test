pipeline {
    agent any

    environment {
        SSH_SERVER = "Webserver"
        REMOTE_DIR = "/Webserver/React"
        IMAGE_NAME = "react_app"
        IMAGE_TAG  = "latest"
    }

    stages {
        stage('Transfer Dockerfile') {
            steps {
                sshPublisher(publishers: [
                    sshPublisherDesc(
                        configName: "${SSH_SERVER}",
                        transfers: [
                            sshTransfer(
                                sourceFiles: "Dockerfile",   // only send Dockerfile
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
                sshPublisher(publishers: [
                    sshPublisherDesc(
                        configName: "${SSH_SERVER}",
                        transfers: [],
                        verbose: true,
                        execCommand: """
                            cd ${REMOTE_DIR} && \
                            docker build -t ${IMAGE_NAME}:${IMAGE_TAG} . && \
                            docker rm -f ${IMAGE_NAME} || true && \
                            docker run -d --name ${IMAGE_NAME} -p 80:80 ${IMAGE_NAME}:${IMAGE_TAG}
                        """
                    )
                ])
            }
        }
    }

    post {
        success {
            echo "✅ Frontend container is running on port 80 at ${SSH_SERVER}"
        }
        failure {
            echo "❌ Deployment failed. Check logs."
        }
    }
}
