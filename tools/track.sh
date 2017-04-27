#!/bin/bash
# $0 is a script name, $1, $2, $3 etc are passed arguments
# $1 is our command
# Usage example: ./track.sh python django

CMD=$1
SERVICE_DOMAIN=https://ei5v6h5fz6.execute-api.eu-west-1.amazonaws.com

case "$CMD" in
    "wordpress-classic" )
        ;;

    "wordpress" )
        ;;

    "python" )
        LABEL=${2:-django}
        PROJECT="$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME"
        VERSION=${CIRCLE_TAG:-$CIRCLE_SHA1}
        pip freeze > post-requirements.txt
        URL="$SERVICE_DOMAIN/stage/tracker/python?project=$PROJECT&version=$VERSION&label=$LABEL&branch=$CIRCLE_BRANCH&commit=$CIRCLE_SHA1"

        curl -X POST $URL -H "Content-Type: text/plain; charset=utf-8" -H "x-api-key: $TRACKER_API_KEY" --data-binary @post-requirements.txt
        ;;

    "nodejs" )
        ;;
esac
