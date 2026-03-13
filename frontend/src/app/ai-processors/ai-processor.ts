import { Injector, ProviderToken } from "@angular/core";

export class AiActionParameter {
  public name: string;
  public type: string;
  public description: string;

  constructor(name: string, type: string, description: string) {
    this.name = name;
    this.type = type;
    this.description = description;
  }
}

export class AiAction {
  public name: string;
  public parameters: AiActionParameter[];
  public func: (parameters: { [p: string]: string }, injector: Injector) => void;

  constructor(name: string, parameters: AiActionParameter[], func: (parameters: { [p: string]: string }, injector: Injector) => void) {
    this.name = name;
    this.parameters = parameters;
    this.func = func;
  }
}

export class AiProcessor {
  public appName: string;
  public actions: AiAction[];
  public examples: [string, string, string][];

  constructor(appName: string, actions: AiAction[], examples: [string, string, string][]) {
    this.appName = appName;
    this.actions = actions;
    this.examples = examples;
  }
}

export type AiProcessorOverview = { keywords: string[], actions: string[] };
export type AiActionOverview = { keywords: string[], parameters: { [param: string]: AiParameterOverview } };
type AiParameterOverview = { type: string, description: string };

export interface AiProcessableComponent {
  process(action: string, parameters: { [p: string]: string }): void;
}
