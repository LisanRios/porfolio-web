import PDFDocument from 'pdfkit';

export function createCvPdf(portfolio) {
  return new Promise((resolve, reject) => {
    const document = new PDFDocument({ margin: 48 });
    const chunks = [];

    document.on('data', (chunk) => chunks.push(chunk));
    document.on('end', () => resolve(Buffer.concat(chunks)));
    document.on('error', reject);

    document.fontSize(22).text('Lisandro Gabriel Rios De Morla');
    document.fontSize(12).text(portfolio.position ?? 'Programador Full Stack');
    document.moveDown();

    document.fontSize(16).text('Perfil');
    document.fontSize(11).text(
      `Ubicacion: ${portfolio.ubication ?? 'Buenos Aires, Argentina'}`
    );
    document.moveDown();

    document.fontSize(16).text('Experiencia');
    for (const work of portfolio.trabajo ?? []) {
      document.fontSize(12).text(`${work.type} - ${work.name}`, { continued: false });
      document.fontSize(10).text(`${work.dateInicio} - ${work.dateFin}`);
      for (const item of work.description ?? []) {
        document.fontSize(10).text(`- ${item.punto}`);
      }
      document.moveDown(0.5);
    }

    document.fontSize(16).text('Proyectos');
    for (const project of portfolio.project ?? []) {
      document.fontSize(12).text(project.name);
      document.fontSize(10).text(project.description);
      document.moveDown(0.5);
    }

    document.fontSize(16).text('Tecnologias');
    document.fontSize(10).text((portfolio.tecnology ?? []).map((item) => item.name).join(', '));

    document.end();
  });
}
