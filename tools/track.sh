#!/bin/bash
# Usage example: ./track.sh python django

containsElement () {
    local e match="$1"
    shift
    for e; do [[ "$e" == "$match" ]] && return 0; done
    return 1
}

CMD=$1
CIRCLE_BRANCH=${CIRCLE_BRANCH:-master}
SERVICE_DOMAIN=${TRACKER_API:=https://n2t2izj4a0.execute-api.eu-west-1.amazonaws.com}
PROJECT="$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME"
VERSION=${CIRCLE_TAG:-$CIRCLE_SHA1}

IGNORE_BRANCHES=$TRACKER_IGNORE_BRANCHES
IFS=', ' read -r -a IGNORE_BRANCHES <<< "$IGNORE_BRANCHES"

if [ -z "$TRACKER_API_KEY" ]; then 
    echo "Error: Missing TRACKER_API_KEY value"; 
    exit; 
fi

if containsElement $CIRCLE_BRANCH "${IGNORE_BRANCHES[@]}"; then
    echo "Ignoring branch $CIRCLE_BRANCH";
    exit;
fi

case "$CMD" in
    "wp-bedrock-circle-setup" )
        if [ ! -f "test.env" ]; then
            cat > test.env <<EOL
DB_USER=ubuntu
DB_NAME=circle_test
DB_PASSWORD=
DB_HOST=127.0.0.1
WP_HOME=
WP_SITEURL=
EOL
        fi

        mv test.env .env
        composer install
        curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar && chmod +x ./wp-cli.phar
        ./wp-cli.phar core install --allow-root --admin_name=admin --admin_password=admin --admin_email=admin@example.com --url=http://example.com.dev --title=WordPress
        ;;

    "wp-circle2-setup" )
        curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar && chmod +x ./wp-cli.phar
        ./wp-cli.phar core config --allow-root --dbname=circle_test --dbuser=root --dbhost=localhost
        ./wp-cli.phar core install --allow-root --admin_name=admin --admin_password=admin --admin_email=admin@example.com --url=http://example.com.dev --title=WordPress
        ;;

    "wp-circle-setup" )
        curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar && chmod +x ./wp-cli.phar
        ./wp-cli.phar core config --allow-root --dbname=circle_test --dbuser=ubuntu --dbhost=127.0.0.1
        ./wp-cli.phar core install --allow-root --admin_name=admin --admin_password=admin --admin_email=admin@example.com --url=http://example.com.dev --title=WordPress
        ;;

    "wordpress" )
        WP_VERSION=$(./wp-cli.phar core version)
        URL="$SERVICE_DOMAIN/prod/tracker/wp?project=$PROJECT&version=$VERSION&wpversion=$WP_VERSION&branch=$CIRCLE_BRANCH&commit=$CIRCLE_SHA1"
        curl -X POST $URL -H "Content-Type: application/json; charset=utf-8" -H "x-api-key: $TRACKER_API_KEY" -d $(./wp-cli.phar plugin list --format=json)
        ;;

    "python" )
        LABEL=${2:-django}
        pip freeze > post-requirements.txt
        URL="$SERVICE_DOMAIN/prod/tracker/python?project=$PROJECT&version=$VERSION&label=$LABEL&branch=$CIRCLE_BRANCH&commit=$CIRCLE_SHA1"
        curl -X POST $URL -H "Content-Type: text/plain; charset=utf-8" -H "x-api-key: $TRACKER_API_KEY" --data-binary @post-requirements.txt
        rm post-requirements.txt
        ;;

    "node" )
        LABEL=${2:-node}
        URL="$SERVICE_DOMAIN/prod/tracker/node?project=$PROJECT&version=$VERSION&label=$LABEL&branch=$CIRCLE_BRANCH&commit=$CIRCLE_SHA1"
        curl -X POST $URL -H "Content-Type: application/json; charset=utf-8" -H "x-api-key: $TRACKER_API_KEY" -d @package.json
        ;;
esac
