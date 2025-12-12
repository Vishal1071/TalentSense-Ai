import fs from "fs";
import mammoth from "mammoth";
import PDFParser from "pdf2json";


export const extractTextFromFile = async (filePath, MimeType) => {
    if (MimeType === "application/pdf") {
        return await new Promise((resolve, reject) => {
            const pdfParser = new PDFParser();

            pdfParser.on("pdfParser_dataError", (err) => {
                reject(err.parserError);
            });

            pdfParser.on("pdfParser_dataReady", (data) => {
                let text = "";

                // Extract text from PDF pages
                data.Pages.forEach((page) => {
                    page.Texts.forEach((textItem) => {
                        const decoded = decodeURIComponent(
                            textItem.R[0].T.replace(/\+/g, " ")
                        );
                        text += decoded + " ";
                    });
                });

                resolve(text);
            });

            pdfParser.loadPDF(filePath);
        });
    }

    if (
        MimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value;
    }

    throw new Error("Unsupport file type");
};