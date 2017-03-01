# VersionWatcher

## Requirements

- awscli (`pip install awscli`)
- node 4.2


## Installing

- TODO

## Usage

### Python

```
DATA=$(pip freeze)
curl -X POST https://ei5v6h5fz6.execute-api.eu-west-1.amazonaws.com/stage/tracker/python?project=Frojd/Client&version=v1.0.0&label=django -d $DATA
```

### PHP

```
DATA=$(wp plugin list)
curl -X POST --form $DATA --form project=Frojd/Client --form version=v1.1.1 --form secret=123 https://123.execute-api.region-id.amazonaws.com/tracker/php
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
        pre:
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
              VERSION=${CIRCLE_TAG:-$CIRCLE_BRANCH} &&
              WP_VERSION=$(./wp-cli.phar core version) &&
              URL="https://ei5v6h5fz6.execute-api.eu-west-1.amazonaws.com/stage/tracker/wp?project=$PROJECT&version=$VERSION&wpversion=$WP_VERSION" &&
              curl -X POST $URL -H "Content-Type: text/plain; charset=utf-8" -d $(./wp-cli.phar plugin list --format=json)
    ```

### Node

```
curl -H "Content-Type: application/json" -X POST -d @package.json https://ei5v6h5fz6.execute-api.eu-west-1.amazonaws.com/stage/tracker/node?project=Frojd/Client
```

### #C

## Data format
