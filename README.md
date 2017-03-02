# VersionWatcher

## Usage

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
            - |
              PROJECT="$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME" &&
              VERSION=${CIRCLE_TAG:-$CIRCLE_SHA1} &&
              WP_VERSION=$(./wp-cli.phar core version) &&
              URL="https://ei5v6h5fz6.execute-api.eu-west-1.amazonaws.com/stage/tracker/wp?project=$PROJECT&version=$VERSION&wpversion=$WP_VERSION&branch=$CIRCLE_BRANCH" &&
              curl -X POST $URL -H "Content-Type: application/json; charset=utf-8" -d $(./wp-cli.phar plugin list --format=json)
    ```

### Wordpress Classic on Circle CI

When tracking wordpress we need to both install wp-cli and wordpress.

1. Begin with making sure you have a wp-cli.yml file in your repository root that points to your wordpress dir.

    ```bash
    echo "path: src/" > wp-cli.yml
    ```

2. Copy+paste these sections into your circle.yml file.

    ```yml
    dependencies:
        override:
            - ...
        post:
            # Install wordpress
            - curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar && chmod +x ./wp-cli.phar
            - ./wp-cli.phar core config --allow-root --dbname=circle_test --dbuser=ubuntu --dbhost=127.0.0.1
            - ./wp-cli.phar core install --allow-root --admin_name=admin --admin_password=admin --admin_email=admin@example.com --url=http://exmaple.com.dev --title=WordPress

    test:
        override:
          - ...
        post:
            # Track dependencies
            - |
              PROJECT="$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME" &&
              VERSION=${CIRCLE_TAG:-$CIRCLE_SHA1} &&
              WP_VERSION=$(./wp-cli.phar core version) &&
              URL="https://ei5v6h5fz6.execute-api.eu-west-1.amazonaws.com/stage/tracker/wp?project=$PROJECT&version=$VERSION&wpversion=$WP_VERSION&branch=$CIRCLE_BRANCH" &&
              curl -X POST $URL -H "Content-Type: application/json; charset=utf-8" -d $(./wp-cli.phar plugin list --format=json)
    ```

### Python on Circle CI

1. Copy+paste this section into your circle.yml file.

    ```yml
    test:
        override:
            - ...
        post:
            # Track dependencies
            - |
            LABEL="django" &&
            PROJECT="$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME" &&
            VERSION=${CIRCLE_TAG:-$CIRCLE_SHA1} &&
            pip freeze > post-requirements.txt &&
            URL="https://ei5v6h5fz6.execute-api.eu-west-1.amazonaws.com/stage/tracker/python?project=$PROJECT&version=$VERSION&label=$LABEL&branch=$CIRCLE_BRANCH" &&
            curl -X POST $URL -H "Content-Type: text/plain; charset=utf-8" --data-binary @post-requirements.txt
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
        - |
          PROJECT="$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME" &&
          VERSION=${CIRCLE_TAG:-$CIRCLE_SHA1} &&
          URL="https://ei5v6h5fz6.execute-api.eu-west-1.amazonaws.com/stage/tracker/node?project=$PROJECT&version=$VERSION&branch=$CIRCLE_BRANCH" &&
          curl -X POST $URL -H "Content-Type: application/json; charset=utf-8" -d @package.json
```

### C#

- TODO


## Developing

### Requirements

- awscli (`pip install awscli`)
- node 4.2

### Installing

- `npm install`

### Testing

- `npm test`

### Deploying

- `npm test`


## Roadmap

- [ ] Tracking PHP + Composer
- [ ] Tracking for Python
- [ ] Tracking for C#
- [ ] Add handling for duplicate versions
- [ ] Implement api keys
- [ ] Implement endpoint that allows browsing of data
- [ ] Add timestamps to tracking model
