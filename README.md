# VersionWatcher

This is a tool for keeping track on project dependencies.

## Usage (Tracking)

- [Wordpress with Bedrock on Circle CI](#wordpress-with-bedrock-on-circle-ci)
- [Wordpress on Circle CI](#wordpress-on-circle-ci)
- [Python on Circle CI](#python-on-circle-ci)
- [Node.js on Circle CI](#nodejs-on-circle-ci)

### Wordpress with Bedrock on Circle CI

When tracking wordpress we need to both install wp-cli, composer and wordpress.

1. Begin with making sure you have a wp-cli.yml file in your repository root that points to your wordpress dir.

    ```bash
    echo "path: src/" > wp-cli.yml
    ```

2. Next, make sure you have a file called `test.env` in your repo root.

    ```
    DB_USER=ubuntu
    DB_NAME=circle_test
    DB_PASSWORD=
    DB_HOST=127.0.0.1
    WP_HOME=
    WP_SITEURL=
    ```

3. Copy+paste these sections into your circle.yml file.

    ```yml
    dependencies:
        override:
            - composer install
            - ...
        post:
            # Install wordpress
            - curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar && chmod +x ./wp-cli.phar
            - mv test.env .env
            - ./wp-cli.phar core install --allow-root --admin_name=admin --admin_password=admin --admin_email=admin@example.com --url=http://exmaple.com.dev --title=WordPress

    test:
        override:
          - ...
        post:
            # Track dependencies
            - curl -O https://raw.githubusercontent.com/Frojd/VersionWatcher/master/tools/track.sh
            - chmod +x ./track.sh && ./track.sh wordpress
    ```

### Wordpress Classic on Circle CI

When tracking wordpress we need to both install wp-cli and wordpress.

1. Begin with making sure you have a wp-cli.yml file in your repository root that points to your wordpress dir.

    ```bash
    echo "path: src/" > wp-cli.yml
    ```

2. Copy+paste these sections into your circle.yml file.

    ```yml
    test:
        override:
          - ...
        post:
            # Track dependencies
            - curl -O https://raw.githubusercontent.com/Frojd/VersionWatcher/master/tools/track.sh && chmod +x ./track.sh
            - ./track.sh wp-circle-setup && ./track.sh wordpress
    ```

### Python on Circle CI

1. Copy+paste this section into your circle.yml file.

    ```yml
    test:
        override:
            - ...
        post:
            # Track dependencies
            - curl -O https://raw.githubusercontent.com/Frojd/VersionWatcher/master/tools/track.sh
            - chmod +x ./track.sh && ./track.sh python django
    ```

The parameter `LABEL` is optional and should refer to the framework or cms in use (Example: `wagtail`, `django`, `flask`)


### Node.js on Circle CI

1. Copy+paste this section into your circle.yml file.

```yml
test:
    override:
        - ...
    post:
        # Track dependencies
        - curl -O https://raw.githubusercontent.com/Frojd/VersionWatcher/master/tools/track.sh
        - chmod +x ./track.sh && ./track.sh node
```

### C#

- TODO


## Usage (Reading)

- `tracker/stable`

Params:
```
project (example "Frojd/Client-project")
package (example "wordpress:4.7.2")
```

## Developing

This application is built on the serverless framework, hosted on aws, utilizing AWS Lambda and DynamoDB. The application is written in Node.js

### Requirements

- awscli (`pip install awscli`)
- node 6.10

### Installing

- `npm install`

### Testing

- `npm test`

### Deploying

- `npm test`


## Roadmap

- [x] Tracking PHP + Composer
- [x] Tracking for Python
- [x] Add timestamps to tracking model
- [x] Add commit-id field
- [ ] Tracking for C#
- [x] Implement endpoint that allows browsing of data
    - [x] Show latest versions
- [x] Implement api keys
- [x] Sort result by date
- [x] Include x-api key in implementation examples
- [x] Make production release of tool
- [ ] Pretty print date in result listing
- [ ] Lower lambda memory
- [ ] Update Node.js version
- [ ] Error management in request handler
