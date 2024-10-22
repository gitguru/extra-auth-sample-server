#!/bin/bash
# export AWS_ECR_URL=$(aws --profile kobox --region us-west-1 ecr describe-repositories | jq -r '.repositories[0].repositoryUri')
# export AWS_ECR_URL="071215964715.dkr.ecr.us-west-1.amazonaws.com/extra_auth_sample_server_tmp"
# aws --profile kobox --region us-west-1 ecr get-login-password | docker login --username AWS --password-stdin $(echo $AWS_ECR_URL | sed -r "s/\/.*//g")

export DT=`date '+%Y%m%d%H%M%S'`
export IMG_TAG="extra_auth_sample_server_tmp-main-${DT}"
export AWS_ECR_URL="071215964715.dkr.ecr.us-west-2.amazonaws.com/shs-common-frontend"

docker build -f Dockerfile . -t ${AWS_ECR_URL}:${IMG_TAG}
aws --profile kobox --region us-west-2 ecr get-login-password | docker login --username AWS --password-stdin $(echo $AWS_ECR_URL | sed -r "s/\/.*//g")
docker push ${AWS_ECR_URL}:${IMG_TAG}
