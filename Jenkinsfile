pipeline {
    options {
        timestamps()
        skipDefaultCheckout()
    }
    agent {
        node { label 'build && aws && linux'}
    }
    parameters {
        string(name: 'BUILD_VERSION', defaultValue: '', description: 'The build version to deploy (optional)')
    }
    triggers {
        pollSCM('H/5 * * * *')
    }
    environment {
        PROJECT_NAME = "rampdb-client"
        DOCKER_REPO_NAME = "684150170045.dkr.ecr.us-east-1.amazonaws.com/rampdb-client"
    }
    stages {
        stage('Build Version') {
            when {
                expression {
                    return !params.BUILD_VERSION
                }
            }
            steps{
                script {
                    BUILD_VERSION_GENERATED = VersionNumber(
                        versionNumberString: 'v${BUILD_YEAR, XX}.${BUILD_MONTH, XX}${BUILD_DAY, XX}.${BUILDS_TODAY}',
                        projectStartDate:    '1970-01-01',
                        skipFailedBuilds:    true)
                    currentBuild.displayName = BUILD_VERSION_GENERATED
                    env.BUILD_VERSION = BUILD_VERSION_GENERATED
                    env.BUILD = 'true'
                }
            }
        }
        stage('Build') {
            when {
                expression {
                       return env.BUILD == 'true'
                }
            }
            steps {
                sshagent (credentials: ['871f96b5-9d34-449d-b6c3-3a04bbd4c0e4']) {
                    withEnv([
                        "IMAGE_NAME=rampdb-client",
                        "BUILD_VERSION=" + (params.BUILD_VERSION ?: env.BUILD_VERSION)
                    ]) {
                        checkout scm
                            script {
                                def image = docker.build("${env.IMAGE_NAME}","--no-cache ."
                                )
                                docker.withRegistry("https://684150170045.dkr.ecr.us-east-1.amazonaws.com", "ecr:us-east-1:aws-jenkins-build") {
                                docker.image("${env.IMAGE_NAME}").push("${env.BUILD_VERSION}")
                            }
                        }
                    }
                }
            }
        }
        stage('Deploy Application') {
            agent {
                node { label 'rampdb-ci-ec2-02'}
            }
            steps {
                cleanWs()
                configFileProvider([
                    configFile(fileId: 'rampdb-client-docker-compose.yml', targetLocation: 'docker-compose.yml'),
                    configFile(fileId: 'config.json', targetLocation: 'config.json')
                ]) {
                    withEnv([
                            "IMAGE_NAME=rampdb-client",
                            "BUILD_VERSION=" + (params.BUILD_VERSION ?: env.BUILD_VERSION)
                        ]) {
                        withAWS(credentials:'aws-jenkins-build') {
                            sh '''
                            chmod 755 config.json
                            export DOCKER_LOGIN="`aws ecr get-login --no-include-email --region us-east-1`"
                            $DOCKER_LOGIN
                            '''
                            ecrLogin()
                            script {
                                def docker = new org.labshare.Docker()
                                docker.deployDockerUI()
                            }
                        }
                    }
                }
            }
        }
    }
}