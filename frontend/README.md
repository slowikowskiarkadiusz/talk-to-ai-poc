<!--# TalkToAiPoc

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.-->

```
OLLAMA_ORIGINS="*" OLLAMA_HOST=0.0.0.0 ollama serve
ng serve --host 0.0.0.0 --ssl
```

first prompt:
{
  "actions": {
    "open page":{}
    "open module":{
      "one of": {
        "plant growth": {
          "keywords": ["field monitoring", "crop inspection", "pest surveillance", "field observation", "agronomic walk", "field scouting log"],
          "actions": ["create report", "show chart"]
        },
        "devices": {
          "keywords": ["iot", "remote devices", "internet of things", "device management", "smart home", "smart devices"]
          "actions": ["turn device on or off", "dim lamp", "tweak thermostat"]
        },
        "weather": {
          "keywords": ["climate monitoring", "agrometeorology", "field weather", "microclimate tracking", "atmospheric conditions", "weather station data"]
          "actions": ["show forecast"]
        }
      }
    }
  }
}

plant growth:
{
  "create report":{
    "keywords": ["new entry"],
    "parameters":{}
  },
  "show chart":{
    "keywords": ["summarize data"]
    "parameters":{
      "property":{
        "type": "string",
        "description": "the name of the property to show on the chart. one of: [ PlantHeight, StemWidth, LeafWidth, BedDepth]"
      }
    }
  }
}

devices actions:
{
  "turn device on or off": {
    "keywords":["turn off", "turn on", "disable"],
    "parameters":{
      "deviceName": {
        "type":"string",
        "description":"the name of the device"
      }
    }
  },
  "tweak thermostat": {
    "keywords":["set temperature", "warmer", "cooler"]
  },
  "dim lamp": {
    "keywords": ["light", "dark"],
    "parameters":{
      "deviceName": {
        "type":"string",
        "description":"the name of the lamp"
      }
    }
  }
}

weather actions:
{
  "show forecast":{
    "keywords": ["what will be the weather", "forecast"]
  },
}
