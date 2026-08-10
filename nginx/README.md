# nginx

[nginx](https://nginx.org/) is the gateway to the starbug services.

It is a TLS endpoint so it can accept geo-location data from
the user's browser.

- [nginx](#nginx)
- [Self Signed Certificate](#self-signed-certificate)
  - [Generate](#generate)
  - [dhparam](#dhparam)
- [Debug](#debug)
  - [curl](#curl)
- [Setup certbot](#setup-certbot)
  - [Initialize](#initialize)
  - [Setup](#setup)
  - [Request certificates.](#request-certificates)
  - [Run](#run)


# Self Signed Certificate

## Generate

Create a key in a cert directory docker-compose can see but git ignores, e.g. ./nginx/certs.

```
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout starbug.selfsigned.key -out starbug.selfsigned.crt
```

```
Mac-mini-2023 certs % openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout starbug.selfsigned.key -out starbug.selfsigned.crt
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

## dhparam

add dhparam for [Forward Security](https://en.wikipedia.org/wiki/Forward_secrecy)

```
openssl dhparam -out dhparam.pem 2048
```

```
Mac-mini-2023 certs % openssl dhparam -out dhparam.pem 2048

Generating DH parameters, 2048 bit long safe prime, generator 2
This is going to take a long time
......................................

```

# Debug

On the running self-signed example

```
docker exec -it www_starbug_com-nginx-1 /bin/bash
```


## curl

```
docker exec www_starbug_com-nginx-1 curl -v https://www.starbug.com
```

```
docker exec www_starbug_com-nginx-1 curl -k -s -o /dev/null -w "%{http_code}\n" https://www.starbug.com
```

# Setup certbot


## Initialize

Set up the unsecure port 80 to have certbot initialize certs.
Use letsencrypt/setup/conf.d

## Setup

Switch to letsencrypt/run to use the new certs.

Modify docker-compose.yml to mount the setup config.
This is all unsecure port 80 http no s.
Update the DNS records to point to this new instance.
This will allow letsencrypt to install the certs.

```
...
    volumes:
      - ./nginx/letsencrypt/setup/conf.d:/etc/nginx/conf.d:ro

...
```

This can be run on the development host.
Test in an incognito window to "forget" ssl 301 from
previous testing.

http://localhost/

http://0.0.0.0/


## Request certificates.

In a shell on the host run

```
docker run --rm -it -v "$(pwd)/certbot/www:/var/www/certbot:rw" -v "$(pwd)/certbot/conf:/etc/letsencrypt:rw" certbot/certbot certonly --webroot --webroot-path=/var/www/certbot --email lrm@starbug.com --agree-tos --no-eff-email -d starbug.com -d www.starbug.com
```

```

ubuntu@ip-172-31-8-19:/opt/starbug/www_starbug_com$ docker run --rm -it -v "$(pwd)/certbot/www:/var/www/certbot:rw" -v "$(pwd)/certbot/conf:/etc/letsencrypt:rw" certbot/certbot certonly --webroot --webroot-path=/var/www/certbot --email lrm@starbug.com --agree-tos --no-eff-email -d starbug.com -d www.starbug.com
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Account registered.
Requesting a certificate for starbug.com and www.starbug.com

Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/starbug.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/starbug.com/privkey.pem
This certificate expires on 2026-11-08.
These files will be updated when the certificate renews.

NEXT STEPS:
- The certificate will need to be renewed before it expires. Certbot can automatically renew the certificate in the background, but you may need to take steps to enable that functionality. See https://certbot.org/renewal-setup for instructions.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
If you like Certbot, please consider supporting our work by:
 * Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
 * Donating to EFF:                    https://eff.org/donate-le
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
```

## Run

Switch to the letsencrypt/run/conf.d

```
Mac-mini-2023 www_starbug_com % git diff
diff --git a/docker-compose.yml b/docker-compose.yml
index 939fb6a..a0c457c 100644
--- a/docker-compose.yml
+++ b/docker-compose.yml
@@ -50,7 +50,7 @@ services:
       - "80:80"
       - "443:443"
     volumes:
-      - ./nginx/letsencrypt/setup/conf.d:/etc/nginx/conf.d:ro
+      - ./nginx/letsencrypt/run/conf.d:/etc/nginx/conf.d:ro
       - ./certbot/www:/var/www/certbot:ro
       - ./certbot/conf:/etc/letsencrypt:ro
     secrets:

```

and update deploy.
