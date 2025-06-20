"use server";

import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

interface TextItem {
  str: string;
  dir?: string;
  width?: number;
  height?: number;
  transform?: number[];
  fontName?: string;
}

interface TextContent {
  items: TextItem[];
}

interface PDFPage {
  getTextContent(): Promise<TextContent>;
}

interface PDFDocument {
  numPages: number;
  getPage(pageNumber: number): Promise<PDFPage>;
}

interface PDFJSLib {
  GlobalWorkerOptions: {
    workerSrc: string;
  };
  getDocument(options: {
    data: Uint8Array;
    verbosity: number;
    useWorkerFetch: boolean;
    isEvalSupported: boolean;
    useSystemFonts: boolean;
  }): {
    promise: Promise<PDFDocument>;
  };
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    const openai = new OpenAI({ apiKey });

    const formData = await req.formData();
    const pitchFile = formData.get("pitchDeck") as File;

    if (!pitchFile) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await pitchFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let extractedText = "";

    try {
     
      const pdfParse = await import("pdf-parse").then((mod) => mod.default);
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
    } catch (pdfParseError) {
      console.error("pdf-parse failed:", pdfParseError);

    
      try {
        const pdfjsLib = await import("pdfjs-dist") as unknown as PDFJSLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = '';

        const pdf = await pdfjsLib.getDocument({
          data: new Uint8Array(buffer),
          verbosity: 0,
          useWorkerFetch: false,
          isEvalSupported: false,
          useSystemFonts: true,
        }).promise;

        const textPromises = [];
        for (let i = 1; i <= Math.min(pdf.numPages, 20); i++) {
          textPromises.push(
            pdf.getPage(i).then(async (page) => {
              const textContent = await page.getTextContent();
              return textContent.items.map((item: TextItem) => item.str).join(" ");
            })
          );
        }

        const pageTexts = await Promise.all(textPromises);
        extractedText = pageTexts.join(" ");
      } catch (pdfjsError) {
        console.error("pdfjs-dist also failed:", pdfjsError);
        return NextResponse.json(
          {
            success: false,
            error:
              "Unable to parse PDF. Please ensure the file is a valid text-based PDF.",
          },
          { status: 400 }
        );
      }
    }


    extractedText = extractedText.replace(/\s+/g, " ").trim().slice(0, 8000);

    if (!extractedText || extractedText.length < 50) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No meaningful text could be extracted. The PDF may be image-based or corrupted.",
        },
        { status: 400 }
      );
    }

    const prompt = `You are a startup analyst. Analyze the following pitch deck and return ONLY a valid JSON object with no additional text, markdown, or formatting. The JSON should have these exact keys:

{
  "marketSize": "...",
  "productSummary": "...",
  "teamOverview": "...",
  "tractionSummary": "...",
  "redFlags": ["..."]
}

If any section is not available, state that clearly in the corresponding field.

Pitch Deck Content:
"""
${extractedText}
"""`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const analysisText = completion.choices[0].message?.content ?? "{}";

  
    function extractAndCleanJSON(text: string): string {
    
      let cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
    
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      }
      
      return cleaned.trim();
    }

    try {
      const cleanedJSON = extractAndCleanJSON(analysisText);
      const parsed = JSON.parse(cleanedJSON);
      
      const requiredKeys = [
        "marketSize",
        "productSummary",
        "teamOverview",
        "tractionSummary",
        "redFlags",
      ];

      requiredKeys.forEach((key) => {
        if (!(key in parsed)) {
          parsed[key] =
            key === "redFlags" ? [] : "Information not available in the pitch deck.";
        }
      });

      return NextResponse.json({
        success: true,
        analysis: parsed,
        metadata: {
          textExtracted: extractedText.length,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (parseError) {
      console.error("JSON parse failed:", parseError);
      console.error("Raw AI response:", analysisText);
      
      
      return NextResponse.json({
        success: false,
        error: "Failed to parse AI response as JSON",
        debug: {
          rawResponse: analysisText,
          cleanedResponse: extractAndCleanJSON(analysisText)
        }
      }, { status: 422 });
    }
  } catch (error) {
    console.error("Error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

