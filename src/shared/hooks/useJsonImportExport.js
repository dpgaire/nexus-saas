export function useJsonImportExport(onCreate) {
  const exportJson = (data, filename) => {
    const filteredData = data.map(({ id, ...rest }) => rest);

    const blob = new Blob(
      [JSON.stringify(filteredData, null, 2)],
      { type: "application/json" }
    );

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    URL.revokeObjectURL(link.href);
  };

  const importJson = (file) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const parsed = JSON.parse(e.target.result);

      if (!Array.isArray(parsed)) {
        throw new Error("Invalid format");
      }

      for (const item of parsed) {
        await onCreate(item);
      }
    };

    reader.readAsText(file);
  };

  return { exportJson, importJson };
}
