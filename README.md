# MMM-WootDeals
Use this template for creating new MagicMirror² modules.

See the [wiki page](https://github.com/Dennis-Rosenbaum/MMM-WootDeals/wiki) for an in depth overview of how to get started.

# MMM-WootDeals

![Example of MMM-WootDeals](./example_1.png)

[Module description]

## Installation

### Install

In your terminal, go to your [MagicMirror²][mm] Module folder and clone MMM-WootDeals:

```bash
cd ~/MagicMirror/modules
git clone https://github.com/AdamKogut/MMM-WootDeals
```

### Update

```bash
cd ~/MagicMirror/modules/MMM-WootDeals
git pull
```

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:

```js
    {
        module: 'MMM-WootDeals',
        position: 'lower_third'
    },
```

Or you could use all the options:

```js
    {
        module: 'MMM-WootDeals',
        position: 'lower_third',
        config: {
            exampleContent: 'Welcome world'
        }
    },
```

## Configuration options

Option|Possible values|Default|Description
------|------|------|-----------
`exampleContent`|`string`|not available|The content to show on the page

## Sending notifications to the module

Notification|Description
------|-----------
`TEMPLATE_RANDOM_TEXT`|Payload must contain the text that needs to be shown on this module

## Developer commands

- `npm install` - Install devDependencies like ESLint.
- `npm run lint` - Run linting and formatter checks.
- `npm run lint:fix` - Fix linting and formatter issues.

[mm]: https://github.com/MagicMirrorOrg/MagicMirror
