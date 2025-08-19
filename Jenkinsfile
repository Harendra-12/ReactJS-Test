def remoteServer = [
    name: "Webserver",
    host: "18.223.151.223",
    user: "root",
    identityFile: "/root/.ssh/id_rsa",  // path to private key on Jenkins
    allowAnyHosts: true
]

pipeline {
    agent any

    environment {
        REMOTE_DIR = "/root/Webserver/React"
        IMAGE_NAME = "react_app"
        IMAGE_TAG  = "latest"
    }

    stages {
        stage('Transfer Source Code + Dockerfile') {
            steps {
                sshPublisher(publishers: [
                    sshPublisherDesc(
                        configName: "Webserver",  // must match SSH site in Jenkins config
                        transfers: [
                            sshTransfer(
                                sourceFiles: "**/*",
                                remoteDirectory: "${REMOTE_DIR}",
                                flatten: false
                            )
                        ],
                        verbose: true
                    )
                ])
            }
        }

        stage('Build & Run Container') {
            steps {
                sshCommand remote: remoteServer, command: """
                    cd ${REMOTE_DIR} &&
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} . &&
                    docker rm -f ${IMAGE_NAME} || true &&
                    docker run -d --name ${IMAGE_NAME} -p 80:80 ${IMAGE_NAME}:${IMAGE_TAG}
                """
            }
        }
    }

    post {
        success {
            echo "✅ Frontend container is running on port 80"
        }
        failure {
            echo "❌ Something went wrong — check logs."
        }
    }
}
