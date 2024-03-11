# Github Action for setting up `rig` CLI

[Rig](https://docs.rig.dev) is an application platform for Kubernetes. Rig has
a concept of Capsules which is a self-contained deployable unit of your
application. This action installs the rig CLI which you can the use to deploy
docker images.

The action handles download, install and caching of the rig binary.

## Usage

Put the action in a step and optionally set the version if you want something
specific rather than latest.

```yaml
jobs:
  deploy:
    steps:
      - uses: rigdev/setup-rig@v1
        with:
          version: 1.7.1
          host: ${{ vars.RIG_HOST }}
          client-id: ${{ vars.RIG_CLIENT_ID }}
          client-secret: ${{ secrets.RIG_CLIENT_SECRET }}
      - run: |
          rig capsule deploy -B ...
```
