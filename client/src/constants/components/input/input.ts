import type { KeyboardEventHandler } from "react";

export function getOnKeyDownInputEventDuplicator(onValueChanged : (newValue : string) => void, validValueFilter : (value : string) => boolean = () => true, stopPropagation : boolean = true) : KeyboardEventHandler<HTMLInputElement> {
    return (e) => {
        const input = e.currentTarget;
        const closeEventFunc = () => {
          if (stopPropagation) {
            e.stopPropagation();
          } else {
            e.preventDefault();
          }
        };

        if (e.key === "Escape") {
            input.blur();
            closeEventFunc();
            return;
        }

        const currentValue = input.value;
        const newValue : string | undefined = (() => {
            if (e.key === "Backspace") {
                return currentValue.slice(0, -1);
            } else if (e.key.length === 1) {
                return currentValue + e.key;
            }
        })();
        
        
        if (newValue == undefined || !validValueFilter(newValue)) {
          closeEventFunc(); 
          return;
        }
        onValueChanged(newValue);
        
        input.value = newValue;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        closeEventFunc();
    }
}