import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Exporta um elemento HTML para PDF
 */
export const downloadSchedulePDF = async (elRef, filename = "horario.pdf") => {
  if (!elRef?.current) {
    alert("Elemento do horário não encontrado.");
    return;
  }
  
  try {
    const canvas = await html2canvas(elRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "pt", "a4");
    
    pdf.addImage(
      imgData,
      "PNG",
      15,
      40,
      pdf.internal.pageSize.getWidth() - 30,
      0
    );
    
    pdf.save(filename);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    alert("Erro ao gerar PDF. Tente novamente.");
  }
};