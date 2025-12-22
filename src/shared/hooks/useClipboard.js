import toast from "react-hot-toast";

export function useClipboard() {
  const copy = async (text) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };
  return { copy };
}
