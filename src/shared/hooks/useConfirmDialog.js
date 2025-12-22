import { useState } from "react";

export function useConfirmDialog() {
  const [target, setTarget] = useState(null);

  const open = (value) => setTarget(value);
  const close = () => setTarget(null);

  return {
    isOpen: target !== null,
    target,
    open,
    close,
  };
}
