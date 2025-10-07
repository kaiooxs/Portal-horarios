import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Converte uma imagem para base64
 */
const loadImageAsBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
  });
};

/**
 * Exporta um elemento HTML para PDF com logos da escola
 */
export const downloadSchedulePDF = async (elRef, filename = "horario.pdf") => {
  if (!elRef?.current) {
    alert("Elemento do horário não encontrado.");
    return;
  }
  
  try {
    // Capturar o horário
    const canvas = await html2canvas(elRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    
    // Criar PDF em modo paisagem
    const pdf = new jsPDF("landscape", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Carregar logos
    let logoEpalc = null;
    let logoParcerias = null;
    
    try {
      logoEpalc = await loadImageAsBase64("/imagens/logo-epalc.png");
    } catch (error) {
      console.warn("Não foi possível carregar o logo da EPALC:", error);
    }
    
    try {
      logoParcerias = await loadImageAsBase64("/imagens/logo-parcerias.png");
    } catch (error) {
      console.warn("Não foi possível carregar o logo das parcerias:", error);
    }
    
    // Adicionar logo da escola no cabeçalho (se disponível)
    if (logoEpalc) {
      const logoWidth = 150;
      const logoHeight = 40;
      const logoX = (pageWidth - logoWidth) / 2; // Centralizar
      pdf.addImage(logoEpalc, "PNG", logoX, 10, logoWidth, logoHeight);
    }
    
    // Calcular posição do horário (abaixo do logo)
    const contentY = logoEpalc ? 60 : 20;
    const contentHeight = pageHeight - contentY - 60; // Deixar espaço para o footer
    
    // Adicionar horário
    const imgWidth = pageWidth - 30;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Ajustar altura se necessário
    const finalHeight = Math.min(imgHeight, contentHeight);
    
    pdf.addImage(
      imgData,
      "PNG",
      15,
      contentY,
      imgWidth,
      finalHeight
    );
    
    // Adicionar logo das parcerias no rodapé (se disponível)
    if (logoParcerias) {
      const footerLogoWidth = 400;
      const footerLogoHeight = 40;
      const footerLogoX = (pageWidth - footerLogoWidth) / 2; // Centralizar
      const footerLogoY = pageHeight - footerLogoHeight - 10;
      pdf.addImage(logoParcerias, "PNG", footerLogoX, footerLogoY, footerLogoWidth, footerLogoHeight);
    }
    
    // Adicionar texto no rodapé
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    const footerText = `Portal de Horários EPALC © ${new Date().getFullYear()} | Gerado em ${new Date().toLocaleDateString("pt-PT")}`;
    const textWidth = pdf.getTextWidth(footerText);
    const textX = (pageWidth - textWidth) / 2;
    const textY = pageHeight - 5;
    pdf.text(footerText, textX, textY);
    
    pdf.save(filename);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    alert("Erro ao gerar PDF. Tente novamente.");
  }
};