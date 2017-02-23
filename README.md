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

## Data format

### Proposal 1

```
{
    project: 'Frojd/Ciient-Project',
    versions: [
        {
            version: 'v1.1.1',
            packages: [
                ['Django', '1.10.5'],
                ['Django', '1.10.5'],
            ],
            created: 123126753675127563
        },
        {
            version: 'v1.1.1',
            packages: [
                ['Django', '1.10.5'],
                ['Django', '1.10.5'],
            ],
            created: 123126753675127563
        },
    ]
}
```


### Proposal 2

```
{
    project: 'Frojd/Ciient-Project',
    version: 'v1.1.1',
    packages: [
        ['Django', '1.10.5'],
        ['wagtail', '1.10.5'],
    ],
    created: 123126753675127563
}

{
    project: 'Frojd/Ciient-Project',
    version: 'v1.1.0',
    packages: [
        ['Django', '1.10.5'],
        ['wagtail', '1.10.5'],
    ],
    created: 123126753675127563
}

{
    project: 'Frojd/Ciient-Project',
    version: 'v1.0.9',
    packages: [
        ['Django', '1.10.5'],
        ['wagtail', '1.10.5'],
    ],
    created: 123126753675127563
}
```
