# nginx

This is the gateway to the starbug services.

It is a TLS endpoint so it can accept geo-location data from
the user's browser.

# Self Signed Certificate

## Generate a key

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