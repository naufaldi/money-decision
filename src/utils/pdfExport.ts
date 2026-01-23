import { jsPDF } from 'jspdf';

export function exportToPDF(elementId: string, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const element = document.getElementById(elementId);
    if (!element) {
      reject(new Error(`Element with ID "${elementId}" not found in the DOM`));
      return;
    }

    if (!element.offsetWidth || !element.offsetHeight) {
      reject(new Error(`Element with ID "${elementId}" has no visible dimensions`));
      return;
    }

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const timeout = setTimeout(() => {
      reject(new Error('PDF generation timed out. The content may be too large or complex.'));
    }, 30000);

    try {
      doc.html(element, {
        callback: function (pdfDoc: jsPDF) {
          clearTimeout(timeout);
          try {
            pdfDoc.save(`${filename}.pdf`);
            resolve();
          } catch (error) {
            reject(new Error(`Failed to save PDF: ${error instanceof Error ? error.message : 'Unknown error'}`));
          }
        },
        x: 10,
        y: 10,
        width: 190,
        windowWidth: 800,
        autoPaging: 'text',
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        },
      }).catch((error) => {
        clearTimeout(timeout);
        if (error instanceof Error) {
          if (error.message.includes('html2canvas')) {
            reject(new Error('Failed to load html2canvas. Please ensure html2canvas is installed and available.'));
          } else {
            reject(new Error(`PDF generation failed: ${error.message}`));
          }
        } else {
          reject(new Error(`PDF generation failed: ${String(error)}`));
        }
      });
    } catch (error) {
      clearTimeout(timeout);
      reject(new Error(`Failed to initialize PDF generation: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
}
