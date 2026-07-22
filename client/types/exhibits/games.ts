export type EventHandlerArg = number | string | boolean

export type GameEventLinkers = Array<
  GameEventLinker<number> |
  GameEventLinker<string> |
  GameEventLinker<boolean>
>

type GameEventLinker<T> = {
  gameEventName: string;
  handler: (value: T) => void;
};