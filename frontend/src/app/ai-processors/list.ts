import { AiProcessor } from "./ai-processor";

export const aiProcessors: AiProcessor[] = [];

export function pushAiProcessor(...processors: AiProcessor[]) {
  processors.forEach(x => aiProcessors.push(x));
}
