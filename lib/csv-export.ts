interface CsvColumn<T> {
    key: keyof T;
    label: string;
  }
  
  function escapeCsvValue(value: unknown): string {
    const stringValue = value === null || value === undefined ? "" : String(value);
    const needsQuoting = /[",\n]/.test(stringValue);
  
    if (!needsQuoting) return stringValue;
  
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  export function generateCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
    const header = columns.map((col) => escapeCsvValue(col.label)).join(",");
  
    const body = rows
      .map((row) =>
        columns.map((col) => escapeCsvValue(row[col.key])).join(",")
      )
      .join("\n");
  
    return `${header}\n${body}`;
  }
  
  export function downloadCsv(filename: string, csvContent: string): void {
    // Prepend BOM so Excel correctly detects UTF-8 (avoids mangled special characters)
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    URL.revokeObjectURL(url);
  }