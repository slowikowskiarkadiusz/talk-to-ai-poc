import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

export interface AiReaction {
  appName: string;
  action: string;
  actionValues: any[];
}

@Injectable({
  providedIn: 'root'
})
export class AiReactionService {
  public subject: Subject<AiReaction> = new Subject();
}
