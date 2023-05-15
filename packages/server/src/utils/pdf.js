const fs = require("fs");
const PDFDocument = require("pdfkit");

const config = require("../../../../config")

function createInvoicePdf(invoice) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(`${config.server.state_directory}/invoices/${invoice.id}.pdf`));
}

function generateHeader(doc) {
  doc
    .fillColor("#444444")
    .fontSize(25)
    .font("Helvetica-Bold")
    .text("Miftahul Ilm", 50, 60)
    .font("Helvetica")
    .fontSize(11)
    .text("Der Schlüssel des Wissens", 50, 85, { align: "left" })
    .text("MIFTAHULILM LLC", 200, 50, { align: "right" })
    .text("2880W Oakland Park Blvd", 200, 65, { align: "right" })
    .text("Suite 225C", 200, 80, { align: "right" })
    .text("Oakland Park, Fl. US 33311", 200, 95, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc.fillColor("#444444").fontSize(20).text("Rechnung", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(11)
    .text("Rechnungsnummer:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text("MI" + invoice.id, 170, customerInformationTop)
    .font("Helvetica")
    .text("Rechnungsdatum:", 50, customerInformationTop + 15)
    .text(
      formatDate(new Date(invoice.created_at * 1000)),
      170,
      customerInformationTop + 15
    )
    .text("Betrag:", 50, customerInformationTop + 30)
    .text(formatCurrency(invoice.amount), 170, customerInformationTop + 30)

    .font("Helvetica-Bold")
    .text(
      invoice.customer_first_name + " " + invoice.customer_last_name,
      300,
      customerInformationTop
    )
    .font("Helvetica")
    .text(invoice.customer_address_line_1, 300, customerInformationTop + 15)
    .text(
      invoice.customer_postal_code +
        " " +
        invoice.customer_locality +
        ", " +
        invoice.customer_country,
      300,
      customerInformationTop + 30
    )
    .moveDown();

  generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 280;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Beschreibung",
    "Menge",
    "Preis",
    "Gesamtbetrag"
  );

  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 32;

    generateTableRow(
      doc,
      position,
      item.description,
      item.quantity,
      formatCurrency(item.price),
      formatCurrency(item.amount)
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (2 + 1) * 32;

  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "Gesamt:",
    "",
    formatCurrency(invoice.amount)
  );
}

function generateFooter(doc) {
  doc
    .fontSize(11)
    .text(
      "Bitte überweisen Sie den Betrag sofort nach Erhalt der Rechnung auf folgendes Konto:",
      50,
      510,
      { align: "left", width: 500 }
    )
    .text("Kontoinhaber: MIFTAHULILM LLC", 50, 540)
    .text("IBAN: BE55 9671 7228 9544", 50, 555)
    .text("BIC: TRWIBEB1XXX", 50, 570)
    .text("TransferWise Europe SA", 50, 585)
    .text("Avenue Louise 54, Room S52", 50, 600)
    .text("Brussels", 50, 615)
    .text("1050", 50, 630)
    .text("Belgium SA", 50, 645)
    .text("Als Verwendungszweck bitte nur die Rechnungsnummer angeben", 50, 665) // 20
    .fontSize(9)
    .text("Miftahul Ilm Online Arabisch Schule", 50, 750)
    .text("Web: www.arabisch-lernen.net", 215, 750)
    .text("E-Mail: info@arabisch-lernen.net", 380, 750);
}

function generateTableRow(doc, y, item, quantity, unitCost, lineTotal) {
  doc
    .fontSize(11)
    .text(item, 50, y)
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(cents) {
  return (cents / 100).toFixed(2) + " €";
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return day + "." + month + "." + year;
}

module.exports = { createInvoicePdf };
