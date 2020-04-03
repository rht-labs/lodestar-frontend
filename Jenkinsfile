pipeline {

    agent {
        // label "" also could have been 'agent any' - that has the same meaning.
        label "master"
    }
    
    environment {
        // Global Vars

        NAMESPACE_PREFIX="omp"

        PIPELINES_NAMESPACE = "${NAMESPACE_PREFIX}-ci-cd"
        APP_NAME = "omp-frontend"

        JENKINS_TAG = "${JOB_NAME}.${BUILD_NUMBER}".replace("/", "-")
        JOB_NAME = "${JOB_NAME}".replace("/", "-")

        packageJSON = readJSON file: 'package.json'

        PACKAGE_JSON_VERSION = "${packageJSON.version}"

        BASE_URL = "https://[my-application-url].com/"
        BACKEND_URL = "https://[my-application-backend-url].com/"
        CLIENT_ID = "open-management-portal"
        AUTHORIZATION_ENDPOINT = "https://[my-sso-url].com/auth/realms/omp/protocol/openid-connect/auth"
        USERINFO_ENDPOINT = "https://[my-sso-url].com/auth/realms/omp/protocol/openid-connect/userinfo"
        TOKEN_ENDPOINT = "https://[my-sso-url].com/auth/realms/omp/protocol/openid-connect/token"
        END_SESSION_ENDPOINT = "https://[my-sso-url].com/auth/realms/omp/protocol/openid-connect/logout"

    }

    // The options directive is for configuration that applies to the whole job.
    options {
        buildDiscarder(logRotator(numToKeepStr:'10'))
        timeout(time: 15, unit: 'MINUTES')
        ansiColor('xterm')
        timestamps()
    }

    stages {

        stage("Env test namespace") {
            agent {
                node {
                    label "master"
                }
            }
            steps {
                script {
                    // Arbitrary Groovy Script executions can do in script tags
                    env.PROJECT_NAMESPACE = "${NAMESPACE_PREFIX}-test"
                    env.NODE_ENV = "test"
                    env.RELEASE = true
                    env.REACT_APP_BACKEND_URI = "https://omp-backend-omp-test.apps.s11.core.rht-labs.com"
                }
            }
        }

        stage("Ansible") {
            agent {
                node {
                    label "jenkins-slave-ansible"
                }
            }
            stages{
                stage("Ansible Galaxy") {
                    steps {
                        echo '### Ansible Galaxy Installing Requirements ###'
                        sh "ansible-galaxy install -r .applier/requirements.yml --roles-path=.applier/roles"
                    }
                }
                stage("Apply Inventory using Ansible-Playbook") {
                    steps {
                        echo '### Apply Inventory using Ansible-Playbook ###'
                        sh "ansible-playbook .applier/apply.yml -i .applier/inventory/ -e 'include_tags=build'"
                    }
                }
            }
        }

        stage("node-build") {
            agent {
                node {
                    label "jenkins-slave-npm"  
                }
            }
            steps {
                // git branch: 'develop',
                //     credentialsId: 'jenkins-git-creds',
                //     url: 'https://gitlab-${NAMESPACE_PREFIX}-ci-cd.apps.somedomain.com/${NAMESPACE_PREFIX}/todolist.git'
                sh 'printenv'

                echo '### Install deps ###'
                sh 'npm install'

                echo '### Running tests ###'
                sh 'npm run test:ci'

                echo '### Running build ###'
                sh 'npm run build:ci'

                echo '### Packaging App for Nexus ###'
                sh 'npm run package'
                sh 'npm run publish'
                stash 'source'
            }
            // Post can be used both on individual stages and for the entire build.
            post {
                always {
                    archive "**"
                    // junit 'test-report.xml'
                    // junit 'reports/server/mocha/test-results.xml'
                    // publish html

                    // Notify slack or some such
                }
                success {
                    echo "SUCCESS"
                }
                failure {
                    echo "FAILURE"
                }
            }
        }

        stage("Build a Container Image and Push it to Quay") {
            agent {
                node {
                    label "master"  
                }
            }
            when {
                expression { GIT_BRANCH ==~ /(.*tags\/release.*)/  }
            }
            steps {
                
                echo '### Get Binary from Nexus ###'
                sh  '''
                        rm -rf package-contents*
                        curl -v -f http://admin:admin123@${NEXUS_SERVICE_HOST}:${NEXUS_SERVICE_PORT}/repository/zip/com/redhat/omp-frontend/${JENKINS_TAG}/package-contents.zip -o package-contents.zip
                        unzip -o package-contents.zip
                    '''
                echo '### Create Container Image ###'
                sh  '''
                        oc project ${PIPELINES_NAMESPACE} # probs not needed
                        oc patch bc ${APP_NAME} -p "{\\"spec\\":{\\"output\\":{\\"to\\":{\\"kind\\":\\"DockerImage\\",\\"name\\":\\"quay.io/rht-labs/${APP_NAME}:${JENKINS_TAG}\\"}}}}"
                        oc start-build ${APP_NAME} --from-dir=package-contents/ --follow
                    '''
            }
            post {
                always {
                    archive "**"
                }
            }
        }

        stage("Build a Container Image") {
            agent {
                node {
                    label "master"  
                }
            }
            when {
                expression { GIT_BRANCH ==~ /(.*master)/  }
            }
            steps {
                
                echo '### Get Binary from Nexus ###'
                sh  '''
                        rm -rf package-contents*
                        curl -v -f http://admin:admin123@${NEXUS_SERVICE_HOST}:${NEXUS_SERVICE_PORT}/repository/zip/com/redhat/omp-frontend/${JENKINS_TAG}/package-contents.zip -o package-contents.zip
                        unzip -o package-contents.zip
                    '''
                echo '### Create Container Image ###'
                sh  '''
                        oc project ${PIPELINES_NAMESPACE} # probs not needed
                        oc patch bc ${APP_NAME} -p "{\\"spec\\":{\\"output\\":{\\"to\\":{\\"kind\\":\\"ImageStreamTag\\",\\"name\\":\\"${APP_NAME}:${JENKINS_TAG}\\"}}}}"
                        oc start-build ${APP_NAME} --from-dir=package-contents/ --follow
                    '''
            }
            post {
                always {
                    archive "**"
                }
            }
        }
        

    }
}
