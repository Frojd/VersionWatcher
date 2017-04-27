#!/bin/bash
# Usage example: ./track.sh python django

CMD=$1

SERVICE_DOMAIN=${TRACKER_API:=https://n2t2izj4a0.execute-api.eu-west-1.amazonaws.com}
PROJECT="$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME"
VERSION=${CIRCLE_TAG:-$CIRCLE_SHA1}

if [ -z "$TRACKER_API_KEY" ]; then echo "Error: Missing TRACKER_API_KEY value"; exit; fi

case "$CMD" in
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
        ;;

    "node" )
        URL="$SERVICE_DOMAIN/prod/tracker/node?project=$PROJECT&version=$VERSION&branch=$CIRCLE_BRANCH&commit=$CIRCLE_SHA1"
        curl -X POST $URL -H "Content-Type: application/json; charset=utf-8" -H "x-api-key: $TRACKER_API_KEY" -d @package.json
        ;;
esac
