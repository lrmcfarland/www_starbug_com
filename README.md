# www.starbug.com

This is the source for the www.starbug.com website.
It is implemented as two
[docker](https://www.docker.com/) microservices:
[nginx](https://nginx.org/) as a
[reverse proxy](https://en.wikipedia.org/wiki/Reverse_proxy)
SSL endpoint and
[flask](https://flask.palletsprojects.com/en/stable/) as the web server.
The docker build uses python formatters,
[isort](https://isort.readthedocs.io/en/latest/),
[flake8](https://flake8.pycqa.org/en/latest/), and
[black](https://pypi.org/project/black/).
[GitHub actions](https://github.com/features/actions) in the
[deploy.yml](.github/workflows/deploy.yml) workflow
are set to update a pre-existing AWS EC2 ubuntu instance
configured using
[GitHub secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets).
This runs in docker containers.
Nothing else needs to be installed on your development host,
but I found having [poetry](https://python-poetry.org/)
running locally helpful for
[debugging format fails](#pythonformatting).

- [www.starbug.com](#wwwstarbugcom)
- [Hello world](#hello-world)
  - [Start](#start)
  - [Stop](#stop)
- [Test](#test)
  - [Python formatting](#python-formatting)
    - [isort](#isort)
    - [flake8](#flake8)
    - [black](#black)
  - [Unit testing](#unit-testing)
    - [Docker](#docker)
    - [Poetry](#poetry)
- [Deploy](#deploy)
  - [AWS EC2](#aws-ec2)
    - [Create](#create)
      - [Application and OS Images](#application-and-os-images)
      - [Instance Type](#instance-type)
        - [KeyPair](#keypair)
        - [ssh login](#ssh-login)
      - [Network settings](#network-settings)
      - [Firewall](#firewall)
      - [Access](#access)
        - [Access Key](#access-key)
      - [Volumes](#volumes)
    - [Launch](#launch)
    - [Configure](#configure)
      - [Volumes](#volumes-1)
      - [Format](#format)
      - [Mount](#mount)
      - [/etc/fstab](#etcfstab)
      - [chown](#chown)
    - [Docker](#docker-1)
      - [Install docker](#install-docker)
      - [Post install](#post-install)
        - [Docker user](#docker-user)
        - [Start on boot](#start-on-boot)
        - [logs](#logs)
  - [GitHub CI/CD](#github-cicd)
    - [GitHub Secrets](#github-secrets)
    - [Deploy](#deploy-1)
  - [Self Signed Certificate](#self-signed-certificate)
    - [Generate a key](#generate-a-key)
    - [Configure Nginx](#configure-nginx)


# Hello world

To run on a development host, clone this repo.
Use docker compose to start the services from the root directory.
This requires [docker](https://www.docker.com/get-started/)
to be installed on your host.

## Start

From the command line

```
docker compose -f 'docker-compose.yml' up -d --build --remove-orphans
```

The web page should now be visible using a browser here


[http://0.0.0.0](http://0.0.0.0)


or

[http://localhost](http://localhost)


## Stop
```
docker compose down
```

# Test

## Python formatting

To run locally, install [poetry](https://python-poetry.org/docs/).
In the `home` directory, where `pyproject.toml` is located, run:

### isort

[isort](https://isort.readthedocs.io/en/latest/):
isort your imports, so you don't have to.

```
poetry run isort .
```

### flake8

[flake8](https://flake8.pycqa.org/en/latest/):
Your Tool For Style Guide Enforcement.

```
poetry run flake8 .
```

### black

[black](https://pypi.org/project/black/):
The uncompromising code formatter.

```
poetry run black .
```

## Unit testing

### Docker

In the `home` directory

```
docker build -t www_starbug_com-home .
```

### Poetry

Install [poetry](https://python-poetry.org/)

Also in the `home/`

```
poetry run pytest
```

For example

```
lrm@lrmz-Mac-mini-2023 home % poetry run pytest
================================================ test session starts =================================================
platform darwin -- Python 3.14.5, pytest-8.4.2, pluggy-1.6.0
rootdir: /Users/lrm/Library/Mobile Documents/com~apple~CloudDocs/Documents/Computer/src/starbug.2026/www_starbug_com/home
configfile: pyproject.toml
testpaths: tests
plugins: flask-1.3.0
collected 1 item
tests/test_home.py F                                                                                           [100%]

====================================================== FAILURES ======================================================
_____________________________________________________ test_hello _____________________________________________________

app = <Flask 'www_starbug_com'>

    def test_hello(app):
        response = app.test_client().get("/")
        assert response.status_code == 200
>       assert response.data == b"Hello, World with /opt/starbug!"
E       AssertionError: assert b'Hello, Worl...rbug_network!' == b'Hello, Worl.../opt/starbug!'
E
E         At index 18 diff: b's' != b'/'
E         Use -v to get more diff

tests/test_home.py:15: AssertionError
============================================== short test summary info ===============================================
FAILED tests/test_home.py::test_hello - AssertionError: assert b'Hello, Worl...rbug_network!' == b'Hello, Worl.../opt/starbug!'
================================================= 1 failed in 0.88s ==================================================
```

# Deploy


## AWS EC2

How to deploy www_starbug_com an AWS EC2 instance.

### Create

#### Application and OS Images

[EC2 console](https://us-west-1.console.aws.amazon.com/ec2/home?region=us-west-1#Home:) `Launch instance`.

#### Instance Type

Ubuntu, t3.micro type.


##### KeyPair

Generate a [KeyPair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html)
and save the pem file, e.g. KeyPairs/www.starbug.com-2026-05-10.pem.
To access this instance from the allowed IP address above,
use the AWS console get the public IP address,
ec2-54-176-196-103.us-west-1.compute.amazonaws.com in this example,
and add it to the command line with the pem file and user ubuntu like
this:

##### ssh login

```
% ssh -i "KeyPairs/www.starbug.com-2026-05-10.pem" ubuntu@ec2-54-176-196-103.us-west-1.compute.amazonaws.com
```

Note: the IP address changes when the instance is restarted so you
will need to update this as needed.

Note: Make sure to add a line feed at the end when adding this
to GitHub secrets.

#### Network settings

How to Find Your SG ID

1. Navigate to the EC2 Console.
2. On the left-hand navigation pane, under Network & Security, click Security Groups.
3. Review the Group ID column (next to the Group Name) to find your alphanumeric ID.

#### Firewall

Only allow ssh from my IP. Use what is my IP or similar to find.
Allow http and https from anywhere.

#### Access

Create these credentials for ssh access
and [GitHub secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets)
for CI/CD.

##### Access Key

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

#### Volumes

Add two 8 GB extra volume to for `/opt` and `/var`
The extra volumes will need to be mounted.
[Make an Amazon EBS volume available for use](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-using-volumes.html)

### Launch

### Configure

Once it is running login to finish configuration.

[ssh login](#ssh-login)

#### Volumes

Initialize and mount the extra disks for `/opt` and `/var`.

```
ubuntu@ip-172-31-1-227:~$ sudo lsblk -f
NAME         FSTYPE   FSVER LABEL           UUID                                 FSAVAIL FSUSE% MOUNTPOINTS
loop0        squashfs 4.0                                                              0   100% /snap/amazon-ssm-agent/13009
loop1        squashfs 4.0                                                              0   100% /snap/core22/2411
loop2        squashfs 4.0                                                              0   100% /snap/snapd/26382
nvme0n1
├─nvme0n1p1  ext4     1.0   cloudimg-rootfs 6b954d12-072a-4efb-a00e-a5bbe1bc36d7    4.6G    31% /
├─nvme0n1p13 ext4     1.0   BOOT            746ae872-0923-4f92-9622-191c0ffec556    826M    10% /boot
├─nvme0n1p14
└─nvme0n1p15 vfat     FAT32 UEFI            955C-CD3C                              98.1M     6% /boot/efi
nvme2n1
nvme1n1
```

`/dev/nvme0n1` is formatted with several partitions mounted.

```
sudo file -s /dev/nvme0n1
```

For example:
```
ubuntu@ip-172-31-9-157:~$ sudo file -s /dev/nvme0n1
/dev/nvme0n1: DOS/MBR boot sector, extended partition table (last)

ubuntu@ip-172-31-9-157:~$ sudo file -s /dev/nvme0n1p13
/dev/nvme0n1p13: Linux rev 1.0 ext4 filesystem data, UUID=746ae872-0923-4f92-9622-191c0ffec556, volume name "BOOT" (needs journal recovery) (extents) (64bit) (large files) (huge files)

ubuntu@ip-172-31-9-157:~$ sudo file -s /dev/nvme0n1p15
/dev/nvme0n1p15: DOS/MBR boot sector, code offset 0x58+2, OEM-ID "mkfs.fat", Media descriptor 0xf8, sectors/track 63, heads 128, hidden sectors 2107392, sectors 217035 (volumes > 32 MB), FAT (32 bit), sectors/FAT 1670, reserved 0x1, serial number 0x955ccd3c, label: "UEFI       "
```

`/dev/nvme1n1` and `/dev/nvme2n1` not.
“If the output shows simply data, as in the following example output, there is no file system on the device”

```
ubuntu@ip-172-31-9-157:~$ sudo file -s /dev/nvme1n1
/dev/nvme1n1: data
```

#### Format

"Warning:
Do not use this command if you're mounting a volume that already has data on it (for example, a volume that was created from a snapshot). Otherwise, you'll format the volume and delete the existing data."


```
sudo mkfs -t ext4 /dev/nvme1n1
sudo mkfs -t ext4 /dev/nvme2n1
```

For example:
```
ubuntu@ip-172-31-9-157:~$ sudo mkfs -t ext4 /dev/nvme1n1
mke2fs 1.47.2 (1-Jan-2025)
Creating filesystem with 2097152 4k blocks and 524288 inodes
Filesystem UUID: 1a61be49-d489-4665-8798-e7cf751ae722
Superblock backups stored on blocks:
	32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632

Allocating group tables: done
Writing inode tables: done
Creating journal (16384 blocks): done
Writing superblocks and filesystem accounting information: done

```

The disk now formatted

```
ubuntu@ip-172-31-9-157:~$ sudo file -s /dev/nvme1n1
/dev/nvme1n1: Linux rev 1.0 ext4 filesystem data, UUID=1a61be49-d489-4665-8798-e7cf751ae722 (needs journal recovery) (extents) (64bit) (large files) (huge files)
```


#### Mount

`/opt` already exists and is empty.
We will mount the starbug application here.

The other partition will be `/data` which we need to create.

```
sudo mkdir /data
```

```
sudo mount /dev/nvme1n1 /opt
sudo mount /dev/nvme2n1 /data
```

```
ubuntu@ip-172-31-1-227:/$ df -h
Filesystem       Size  Used Avail Use% Mounted on
/dev/root        6.7G  2.1G  4.6G  31% /
tmpfs            455M     0  455M   0% /dev/shm
tmpfs            182M  908K  181M   1% /run
efivarfs         128K  3.7K  120K   3% /sys/firmware/efi/efivars
none             1.0M     0  1.0M   0% /run/credentials/systemd-journald.service
tmpfs            455M     0  455M   0% /tmp
none             1.0M     0  1.0M   0% /run/credentials/systemd-resolved.service
/dev/nvme0n1p13  989M   96M  826M  11% /boot
/dev/nvme0n1p15  105M  6.3M   99M   7% /boot/efi
none             1.0M     0  1.0M   0% /run/credentials/systemd-networkd.service
none             1.0M     0  1.0M   0% /run/credentials/getty@tty1.service
none             1.0M     0  1.0M   0% /run/credentials/serial-getty@ttyS0.service
tmpfs             91M  8.0K   91M   1% /run/user/1000
/dev/nvme1n1     7.8G  2.1M  7.4G   1% /opt
/dev/nvme2n1     7.8G  2.1M  7.4G   1% /data
```

#### /etc/fstab

Update `/etc/fstab` to re-mount this directory after a reboot.

Find the UUID of `/dev/nvme1n1`

```
sudo blkid
```

```
ubuntu@ip-172-31-1-227:/$ sudo blkid
/dev/nvme0n1p1: LABEL="cloudimg-rootfs" UUID="6b954d12-072a-4efb-a00e-a5bbe1bc36d7" BLOCK_SIZE="4096" TYPE="ext4" PARTLABEL="cloudimg-rootfs" PARTUUID="11cd87fd-6998-4910-a85d-04ba2b583906"
/dev/nvme0n1p15: LABEL_FATBOOT="UEFI" LABEL="UEFI" UUID="955C-CD3C" BLOCK_SIZE="512" TYPE="vfat" PARTUUID="e6f25bb1-a87e-490a-a8a0-b8971de884c6"
/dev/nvme0n1p13: LABEL="BOOT" UUID="746ae872-0923-4f92-9622-191c0ffec556" BLOCK_SIZE="4096" TYPE="ext4" PARTUUID="a7ffef85-c6c6-4abf-9a09-4b5104066c05"
/dev/loop1: BLOCK_SIZE="131072" TYPE="squashfs"
/dev/nvme0n1p14: PARTUUID="b6802a66-9dde-4d0b-b60d-bc57d31d2d7a"
/dev/nvme2n1: UUID="0516d848-b2a6-49ad-b851-a6e50459fb2b" BLOCK_SIZE="4096" TYPE="ext4"
/dev/loop2: BLOCK_SIZE="131072" TYPE="squashfs"
/dev/loop0: BLOCK_SIZE="131072" TYPE="squashfs"
/dev/nvme1n1: UUID="ac496379-39f0-49a3-a295-06b2e8a74feb" BLOCK_SIZE="4096" TYPE="ext4"
```

Add the new disks, `nvme1n1` and `nvme2n1`, by UUID to `/etc/fstab`

```
ubuntu@ip-172-31-1-227:/etc$ cat fstab
LABEL=cloudimg-rootfs	/	 ext4	discard,commit=30,errors=remount-ro	0 1
LABEL=BOOT	/boot	ext4	defaults	0 2
LABEL=UEFI	/boot/efi	vfat	umask=0077	0 1
UUID=ac496379-39f0-49a3-a295-06b2e8a74feb /data	ext4	defaults,nofail	0	2
UUID=0516d848-b2a6-49ad-b851-a6e50459fb2b /data	ext4	defaults,nofail	0	2
```

#### chown

Don't forget to make it writeable for user ubuntu.

```
sudo chown ubuntu:ubuntu /data
sudo chown ubuntu:ubuntu /opt
```

### Docker

[ssh login](#ssh-login)

#### Install docker

Follow the [ubuntu install instructions](https://docs.docker.com/engine/install/ubuntu/)

#### Post install

Continue with the [post install](https://docs.docker.com/engine/install/linux-postinstall/)

##### Docker user

```
sudo usermod -aG docker $USER
```

##### Start on boot

```
sudo systemctl enable docker.service
sudo systemctl enable containerd.service
```

##### logs

The default docker logging driver does not rotate logs which will
fill up the disk over time.
[Configure the logging driver](https://docs.docker.com/engine/logging/configure/)
to be `local` so it does rotate all the logs buy default

Create `/etc/docker/daemon.json` and as `root` add

```
{
  "log-driver": "local",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

Restart docker

```
sudo systemctl restart docker
```

Check docker info

```
docker info

Client: Docker Engine - Community
 Version:    29.5.2
 Context:    default
 Debug Mode: false
 Plugins:
  buildx: Docker Buildx (Docker Inc.)
    Version:  v0.34.0
    Path:     /usr/libexec/docker/cli-plugins/docker-buildx
  compose: Docker Compose (Docker Inc.)
    Version:  v5.1.4
    Path:     /usr/libexec/docker/cli-plugins/docker-compose

Server:
 Containers: 0
  Running: 0
  Paused: 0
  Stopped: 0
 Images: 1
 Server Version: 29.5.2
 Storage Driver: overlayfs
  driver-type: io.containerd.snapshotter.v1
 Logging Driver: local
 Cgroup Driver: systemd
 Cgroup Version: 2
 Plugins:
  Volume: local
  Network: bridge host ipvlan macvlan null overlay
  Log: awslogs fluentd gcplogs gelf journald json-file local splunk syslog
 CDI spec directories:
  /etc/cdi
  /var/run/cdi
 Swarm: inactive
 Runtimes: io.containerd.runc.v2 runc
 Default Runtime: runc
 Init Binary: docker-init
 containerd version: 77c84241c7cbdd9b4eca2591793e3d4f4317c590
 runc version: v1.3.5-0-g488fc13e
 init version: de40ad0
 Security Options:
  apparmor
  seccomp
   Profile: builtin
  cgroupns
 Kernel Version: 7.0.0-1004-aws
 Operating System: Ubuntu 26.04 LTS
 OSType: linux
 Architecture: x86_64
 CPUs: 2
 Total Memory: 908.7MiB
 Name: ip-172-31-1-227
 ID: 45c2bb10-fa81-4170-9e4f-87b384ce633e
 Docker Root Dir: /var/lib/docker
 Debug Mode: false
 Experimental: false
 Insecure Registries:
  ::1/128
  127.0.0.0/8
 Live Restore Enabled: false
 Firewall Backend: iptables
  EnableUserlandProxy: true
  UserlandProxyPath: /usr/bin/docker-proxy
```

## GitHub CI/CD

Create a github deploy workflow. 
Use [GitHub secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets) 
to store the keys referenced in [deploy.yml](.github/workflows/deploy.yml)


### GitHub Secrets

In the GitHub under Settings > Secrets and variables > Actions, add these repository secrets:

1. AWS_ACCESS_KEY_ID: from [Access Key](#access-key).
1. AWS_SECRET_ACCESS_KEY: from [Access Key](#access-key).
1. AWS_SG_ID: from [How to Find Your SG ID](#how-to-find-uour-sg-id).
1. EC2_HOST: The public IP address of your EC2 instance.
1. EC2_USERNAME: Usually ubuntu.
1. SSH_PRIVATE_KEY: The contents of your .pem launch key.

Note: EC2_HOST changes on restart. Update as needed.

### Deploy

Use [GitHub actions](https://github.com/features/actions)

Create initial deployment buy clone-ing this repo on the host
where [deploy.yml](.github/workflows/deploy.yml) expects it.
This is setup to trigger on commits pushed to the `deploy` branch.

To trigger the deployment checkout the deploy branch and
`git rebase --onto main main`.
A `git push -f` will trigger a deployment to the configured EC2 host.

The public DNS http (no s) version of the web site should now be available.

## Self Signed Certificate

### Generate a key

Create a key in a cert directory docker-compose can see but git ignores, e.g. ./nginx/certs.

```
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout starbug.selfsigned.key -out starbug.selfsigned.crt
```

```
lrm@lrmz-Mac-mini-2023 certs % openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout starbug.selfsigned.key -out starbug.selfsigned.crt
Generating a 2048 bit RSA private key
..................................................................................................................+++++
................+++++
writing new private key to 'starbug.selfsigned.key'
-----
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) []:US
State or Province Name (full name) []:CA
Locality Name (eg, city) []:Mountain View
Organization Name (eg, company) []:Jupyter Mining Corp
Organizational Unit Name (eg, section) []:DevOps
Common Name (eg, fully qualified host name) []:starbug.com
Email Address []:lrm@starbug.com
```

add dhparam for [Forward Security](https://en.wikipedia.org/wiki/Forward_secrecy)

```
openssl dhparam -out dhparam.pem 2048
```

```
lrm@lrmz-Mac-mini-2023 certs % openssl dhparam -out dhparam.pem 2048

Generating DH parameters, 2048 bit long safe prime, generator 2
This is going to take a long time
......................................
```

### Configure Nginx

Use the stand alone file bind secrets instead of swarm.

Add the certs to in GitHub under Settings > Secrets and variables > Actions.

- NGINX_CRT
- NGINX_KEY
- NGINX_DHPARAM
