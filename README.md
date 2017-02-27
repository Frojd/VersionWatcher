# VersionWatcher

## Requirements

- awscli (`pip install awscli`)
- node


## Installing

## Usage

- Python

```
DATA=$(pip freeze)
curl -X POST --form $DATA --form project=Frojd/Client --form stage=prod --form secret=123 https://123.execute-api.region-id.amazonaws.com/tracker/python
```

- PHP

```
DATA=$(wp plugin list)
curl -X POST --form $DATA --form project=Frojd/Client --form version=v1.1.1 --form secret=123 https://123.execute-api.region-id.amazonaws.com/tracker/php
```

- Wordpress (Circle CI)

```
VERSION=${CIRCLE_TAG:-$CIRCLE_BRANCH}
WP_LIST=$(wp plugin list)
WP_VERSION=$(wp core version)
curl -X POST "https://123.execute-api.eu-west-1.amazonaws.com/stage/tracker/wp?wpversion=${WP_VERSION}&project=${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}&release=${VERSION}" -H "Content-Type: text/plain; charset=utf-8" -d $WP_LIST
```

- Node

```
curl -H "Content-Type: application/json" -X POST -d @package.json https://ei5v6h5fz6.execute-api.eu-west-1.amazonaws.com/stage/tracker/node?project=Frojd/Client
```

## Data format

### Proposal RC

```
{
    project: 'Frojd/Client-Project',
    version: 1.0.0,
    label: 'node',
    language: 'javascript',
    created: 123123123,
    packages: [
        {
            name: 'react',
            version: '1.2.0'
        },
        {
            name: 'webpack',
            version: '2.0.0'
        }
    ]
}
```
