pipeline {

    agent {
        // label "" also could have been 'agent any' - that has the same meaning.
        label "master"
    }
    
    environment {
        // Global Vars

        NAMESPACE_PREFIX="labs"
        GIT_DOMAIN = "github.com"
        GIT_ORG = "rht-labs"

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
            when {
              expression { GIT_BRANCH ==~ /(.*master)/ }
            }
            steps {
                script {
                    // Arbitrary Groovy Script executions can do in script tags
                    env.PROJECT_NAMESPACE = "${NAMESPACE_PREFIX}-test"
                    env.NODE_ENV = "test"
                    env.RELEASE = true
                }
            }
        }
        stage("Env dev namespace") {
            agent {
                node {
                    label "master"
                }
            }
            when {
              expression { GIT_BRANCH ==~ /(.*develop.*|.*feature.*)/ }
            }
            steps {
                script {
                    // Arbitrary Groovy Script executions can do in script tags
                    env.PROJECT_NAMESPACE = "${NAMESPACE_PREFIX}-dev"
                    env.NODE_ENV = "dev"
                }
            }
        }
        stage("Ansible") {
            agent {
                node {
                    label "jenkins-slave-ansible"
                }
            }
            when {
              expression { GIT_BRANCH ==~ /(.*master|.*develop.*|.*feature.*)/ }
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
        stage("Install/Lint/Tests/Build/Nexus") {
            agent {
                node {
                    label "master"
                }
            }
            stages{
                stage("Docker Build"){
                    when {
                        expression { currentBuild.result != 'UNSTABLE' }
                    }
                    steps {
                        echo '### Create Linux Container Image from package ###'
                        sh  '''
                                oc project ${PIPELINES_NAMESPACE} # probs not needed
                                oc patch bc ${APP_NAME} -p "{\\"spec\\":{\\"output\\":{\\"to\\":{\\"kind\\":\\"ImageStreamTag\\",\\"name\\":\\"${APP_NAME}:${JENKINS_TAG}\\"}}}}"
                                oc start-build ${APP_NAME} --follow
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
        stage("Openshift Deployment") {
            agent {
                node {
                    label "jenkins-slave-ansible"
                }
            }
            when {
                allOf{
                    expression { GIT_BRANCH ==~ /(.*master|.*develop.*|.*feature.*)/ }
                    expression { currentBuild.result != 'UNSTABLE' }
                }
            }
            steps {
                echo '### Apply Inventory using Ansible-Playbook ###'
                sh "ansible-galaxy install -r .applier/requirements.yml --roles-path=.applier/roles"
                sh "ansible-playbook .applier/apply.yml -i .applier/inventory/ -e include_tags=${NODE_ENV} -e ${NODE_ENV}_vars='{\"NAME\":\"${APP_NAME}\",\"IMAGE_NAME\":\"${APP_NAME}\",\"IMAGE_TAG\":\"${JENKINS_TAG}\",\"BASE_URL\":\"${BASE_URL}\",\"BACKEND_URL\":\"${BACKEND_URL}\",\"CLIENT_ID\":\"${CLIENT_ID}\",\"AUTHORIZATION_ENDPOINT\":\"${AUTHORIZATION_ENDPOINT}\",\"USERINFO_ENDPOINT\":\"${USERINFO_ENDPOINT}\",\"TOKEN_ENDPOINT\":\"${TOKEN_ENDPOINT}\",\"END_SESSION_ENDPOINT\":\"${END_SESSION_ENDPOINT}\"}'"


                echo '### tag image for namespace ###'
                sh  '''
                    oc project ${PROJECT_NAMESPACE}
                    oc tag ${PIPELINES_NAMESPACE}/${APP_NAME}:${JENKINS_TAG} ${PROJECT_NAMESPACE}/${APP_NAME}:${JENKINS_TAG}
                    '''
                echo '### set env vars and image for deployment ###'
                sh '''
                    oc set env dc ${APP_NAME} NODE_ENV=${NODE_ENV}
                    oc set image dc/${APP_NAME} ${APP_NAME}=docker-registry.default.svc:5000/${PROJECT_NAMESPACE}/${APP_NAME}:${JENKINS_TAG}
                    oc label --overwrite dc ${APP_NAME} stage=${NODE_ENV}
                    oc patch dc ${APP_NAME} -p "{\\"spec\\":{\\"template\\":{\\"metadata\\":{\\"labels\\":{\\"version\\":\\"${PACKAGE_JSON_VERSION}\\",\\"release\\":\\"${RELEASE}\\",\\"stage\\":\\"${NODE_ENV}\\",\\"git-commit\\":\\"${GIT_COMMIT}\\",\\"jenkins-build\\":\\"${JENKINS_TAG}\\"}}}}}"
                    oc rollout latest dc/${APP_NAME}
                '''
                echo '### Verify OCP Deployment ###'
                openshiftVerifyDeployment depCfg: env.APP_NAME,
                    namespace: env.PROJECT_NAMESPACE,
                    replicaCount: '1',
                    verbose: 'false',
                    verifyReplicaCount: 'true',
                    waitTime: '',
                    waitUnit: 'sec'
            }
        }
    }
}
