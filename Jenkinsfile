pipeline {
    agent any

    environment {
        REPO_URL   = "https://github.com/Harendra-12/ReactJS-Test.git"
        BRANCH     = "main"
        SSH_SERVER = "Webserver"
        REMOTE_DIR = "/Webserver/React"
        IMAGE_NAME = "react_app"
        IMAGE_TAG  = "latest"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: "${BRANCH}", url: "${REPO_URL}"
            }
        }

        stage('Transfer Source Code to Webserver') {
            steps {
                sshPublisher(publishers: [
                    sshPublisherDesc(
                        configName: "${SSH_SERVER}",
                        transfers: [
                            sshTransfer(
                                sourceFiles: "**",   // transfer all files from repo
                                remoteDirectory: "${REMOTE_DIR}",
                                flatten: false
                            )
                        ],
                        verbose: true
                    )
                ])
            }
        }

        stage('Build & Run Container on Webserver') {
            steps {
                sshPublisher(publishers: [
                    sshPublisherDesc(
                        configName: "${SSH_SERVER}",
                        transfers: [],
                        verbose: true,
                        execCommand: """
                            cd ${REMOTE_DIR} && \
                            docker build -t ${IMAGE_NAME}:${IMAGE_TAG} . && \
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
            echo "✅ App deployed successfully on ${SSH_SERVER}, available at http://<server-ip>:80"
        }
        failure {
            echo "❌ Deployment failed. Check logs."
        }
    }
}
