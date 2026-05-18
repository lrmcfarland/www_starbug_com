# www.starbug.com

This is the source repo for the www.starbug.com website.

This implementation runs as two microservices
in [docker](https://www.docker.com/) containers.
It is based on [nginx ](https://nginx.org/) running as a reverse proxy
in one container.
It routes traffic to `home`, a [flask](https://flask.palletsprojects.com/en/stable/)
server running in an adjacent container.
These are managed by [docker compose](https://docs.docker.com/compose/) 

- [www.starbug.com](#wwwstarbugcom)
- [docker compose](#docker-compose)
- [Python formatting](#python-formatting)
  - [isort](#isort)
  - [lint](#lint)
  - [Format](#format)
- [Flask unit testing](#flask-unit-testing)
  - [Test the build the image](#test-the-build-the-image)
- [EC2](#ec2)
  - [Network settings](#network-settings)
    - [How to Find Your SG ID](#how-to-find-your-sg-id)
  - [firewall](#firewall)
  - [Access](#access)
    - [KeyPair](#keypair)
    - [Access Key](#access-key)
- [GitHub CI/CD](#github-cicd)
  - [GitHub Secrets](#github-secrets)
  - [deploy workflow](#deploy-workflow)
  - [Actions](#actions)


# docker compose

Use docker compose to start the services from the root directory of the clone of this repo.
This requires [docker](https://www.docker.com/get-started/) to be installed on your host.

```
docker compose -f 'docker-compose.yml' up -d --build --remove-orphans
```

```
docker compose down
```

# Python formatting

To run locally, install [poetry](https://python-poetry.org/docs/).
In the `home` directory, where `pyproject.toml` is located, run:

## isort

```
poetry run isort .
```

## lint
```
poetry run flake8 .
```

## Format
```
poetry run black .
```

# Flask unit testing

In the `home` directory

## Test the build the image

```
docker build -t www_starbug_com-home .
```

This is an example with a mismatch in the hello world text.

```
0.810 ============================= test session starts ==============================                             
0.810 platform linux -- Python 3.11.15, pytest-8.4.2, pluggy-1.6.0                                                 
0.810 rootdir: /www_starbug_com                                                                                    
0.810 configfile: pyproject.toml
0.810 testpaths: tests
0.810 plugins: flask-1.3.0, anyio-4.13.0
0.810 collected 1 item
0.810 
0.810 tests/test_home.py F                                                     [100%]
0.846 
0.846 =================================== FAILURES ===================================
0.846 __________________________________ test_hello __________________________________
0.846 
0.846 app = <Flask 'www_starbug_com'>
0.846 
0.846     def test_hello(app):
0.846         response = app.test_client().get('/')
0.846         assert response.status_code == 200
0.846 >       assert response.data == b"Hello, World with some tests!"
0.846 E       AssertionError: assert b'Hello, world...h main tests!' == b'Hello, world...h some tests!'
0.846 E         
0.846 E         At index 18 diff: b'm' != b's'
0.846 E         Use -v to get more diff
0.846 
0.846 tests/test_home.py:13: AssertionError
0.846 =========================== short test summary info ============================
0.846 FAILED tests/test_home.py::test_hello - AssertionError: assert b'Hello, world....
0.846 ============================== 1 failed in 0.17s ===============================
```
# EC2

Create an ubuntu EC2 instance in AWS to host this.

## Network settings

Use the existing `starbug 2021` vpc for now.

### How to Find Your SG ID
You can quickly locate your Security Group IDs using the AWS Management Console:
1. Navigate to the EC2 Console.
2. On the left-hand navigation pane, under Network & Security, click Security Groups.
3. Review the Group ID column (next to the Group Name) to find your alphanumeric ID.

## firewall

Only allow ssh from my IP. Use what is my IP or similar to find.
Allow http and https from anywhere.

## Access

Create these credentials for ssh access
and [GitHub secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets)
for CI/CD.

### KeyPair

Generate a [KeyPair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html)
and save the pem file, e.g. KeyPairs/www.starbug.com-2026-05-10.pem.
To access this instance from the allowed IP address above,
use the AWS console get the public IP address,
ec2-54-176-196-103.us-west-1.compute.amazonaws.com in this example,
and add it to the command line with the pem file and user ubuntu like
this:

```
% ssh -i "KeyPairs/www.starbug.com-2026-05-10.pem" ubuntu@ec2-54-176-196-103.us-west-1.compute.amazonaws.com
```

Note: the IP address changes when the instance is restarted so you
will need to update this as needed.

Note: Make sure to add a line feed at the end when adding this
to GitHub secrets.

### Access Key

Create [IAM access keys](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html)
to allow the GitHub CI/CD to access the instance to update the
source use AWS access keys.

1. Sign in to the AWS Management Console and open the IAM console.
1. Select "Users" from the navigation pane.
1. Choose the specific user name for whom you want to create keys.
1. Click the "Security credentials" tab.
1. Scroll to "Access keys" and click Create access key.
1. Follow the prompts (typically selecting "Other" or "Command Line Interface") to generate the pair.
1. Download the .csv file or copy the keys immediately. This is the only time the Secret Access Key will be displayed.

Note: Do not add a line feed to these values when adding them to 
GitHub secrets.

# GitHub CI/CD

Create a github deploy workflow. 
Use [GitHub secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets) 
to store the keys referenced in [deploy.yml](.github/workflows/deploy.yml)


## GitHub Secrets

Add these variables in GitHub under Settings > Secrets and variables > Actions:

1. AWS_ACCESS_KEY_ID: from [Access Key](#access-key).
1. AWS_SECRET_ACCESS_KEY: from [Access Key](#access-key).
1. AWS_SG_ID: from [How to Find Your SG ID](#how-to-find-uour-sg-id).
1. EC2_HOST: The public IP address of your EC2 instance.
1. EC2_USERNAME: Usually ubuntu.
1. SSH_PRIVATE_KEY: The contents of your .pem launch key.

Note: EC2_HOST changes on restart. Update as needed.

## deploy workflow

Create initial deployment.
This will create the initial repo on the EC2 instance in
`~/www_starbug_com`.

## Actions

Commits pushed to the `deploy` branch will trigger the deploy
[action](https://github.com/lrmcfarland/www_starbug_com/actions).

My current thinking is to rebase deploy onto master and
do a forced push to trigger a deployment.

TODO move to main in deploy.yml 