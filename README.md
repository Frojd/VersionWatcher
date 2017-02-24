# VersionWatcher

## Requirements

- awscli (`pip install awscli`)
- node


## Installing

## Usage

- Python

```
DATA=$(pip freeze)
curl -X POST --form $DATA --form project=Frojd/Client --form stage=prod --form secret=123 https://versionwatcher.execute-api.region-id.amazonaws.com/track-python
```

- PHP

```
DATA=$(wp plugin list)
curl -X POST --form $DATA --form project=Frojd/Client --form version=v1.1.1 --form secret=123 https://versionwatcher.execute-api.region-id.amazonaws.com/track-php
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
