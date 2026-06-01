// Export utilities for PDF and Excel generation

export function exportToCSV(data: any[], filename: string) {
  const csv = [
    Object.keys(data[0]).join(","),
    ...data.map((row) =>
      Object.values(row)
        .map((val) => `"${val}"`)
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
}

export function exportToJSON(data: any[], filename: string) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.json`;
  link.click();
  window.URL.revokeObjectURL(url);
}

export async function exportToPDF(
  data: any[],
  filename: string,
  title: string
) {
  // Dynamic import to reduce bundle size
  const { jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();

  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 22);

  // Add date
  doc.setFontSize(10);
  doc.text(`Généré le: ${new Date().toLocaleDateString("fr-FR")}`, 14, 32);

  // Add table
  const columns = Object.keys(data[0]);
  const rows = data.map((item) => columns.map((col) => item[col]));

  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 40,
    margin: 14,
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: 255,
      fontStyle: "bold",
    },
    bodyStyles: {
      textColor: 50,
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
  });

  doc.save(`${filename}.pdf`);
}
