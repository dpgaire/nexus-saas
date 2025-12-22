function createJsonImportHandler(importJson) {
  return function handleImport(event) {
    const file = event.target.files[0]; 
    if (file) {
      importJson(file);
    }
  };
}

export { createJsonImportHandler };
