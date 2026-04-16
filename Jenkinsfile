pipeline {
    agent any

    environment {
        REPO_URL = 'https://github.com/monishsoorya31/Event-Calendar'
        BRANCH = 'main'
        DEPLOY_USER = 'soorymonish'
        DEPLOY_HOST = '34.56.203.166'
        DEPLOY_PATH = '/var/www/react-app'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: "${BRANCH}", url: "${REPO_URL}"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to GCP VM') {
            steps {
                sshagent(['gcp-ssh-key']) {
                    sh '''
                    echo "Creating deployment directory if not exists..."
                    ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} "mkdir -p ${DEPLOY_PATH}"

                    echo "Cleaning old files..."
                    ssh ${DEPLOY_USER}@${DEPLOY_HOST} "rm -rf ${DEPLOY_PATH}/*"

                    echo "Copying new build..."
                    scp -r build/* ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/

                    echo "Deployment done!"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Successfully Deployed to GCP VM!'
        }
        failure {
            echo '❌ Deployment Failed!'
        }
    }
}

