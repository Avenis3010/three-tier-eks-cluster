
FROM jenkins/jenkins:lts

USER root

RUN apt-get update && \
    apt-get install -y curl unzip docker.io

# Install kubectl
RUN curl -LO "https://dl.k8s.io/release/v1.30.1/bin/linux/amd64/kubectl" && \
    install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install AWS CLI
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install

USER jenkins
