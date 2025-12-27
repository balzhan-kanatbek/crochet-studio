import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai"; // Ensure you have installed @google/genai
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userImage = formData.get("image") as File;
    const color = formData.get("color") as string;

    if (!userImage || !color) {
      return NextResponse.json(
        { error: "Missing image or color" },
        { status: 400 }
      );
    }

    // Initialize with your secure API key from .env.local
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });

    // Load and convert reference pattern
    const designImagePath = path.join(
      process.cwd(),
      "public",
      "crochet-design.jpg"
    );
    const designBase64 = fs.readFileSync(designImagePath).toString("base64");

    // Convert user's headshot
    const userBuffer = await userImage.arrayBuffer();
    const userBase64 = Buffer.from(userBuffer).toString("base64");

    const promptText = `Create an ultra-high-quality professional fashion photo. 
      Take the exact crochet stitch from the first image and change the yarn color to ${color}. 
      - Generate ONLY ONE crochet bandana and place it accurately on the person's head from the second image.
      - The bandana MUST be positioned on the top of the head, so the part of the forehead hair is visible.
      - Ensure the bandana wraps symmetrically around both sides of the skull and covers the top of the ears the ears.
      - NEGATIVE CONSTRAINT: Do not add any secondary bandanas, scarves, or crochet fabric around the neck.
      - The person's original collar and neck area must remain completely visible and unchanged.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview", // Target Nano Banana Pro
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { data: designBase64, mimeType: "image/jpeg" } },
            { inlineData: { data: userBase64, mimeType: userImage.type } },
            { text: promptText },
          ],
        },
      ],
      config: {
        // Set response modalities to ensure an image is returned
        responseModalities: ["IMAGE"],
      },
    });

    // Extract image data from the response candidates
    const generatedPart = response.candidates?.[0]?.content?.parts?.find(
      (p) => p.inlineData
    );

    if (generatedPart?.inlineData) {
      const imageUrl = `data:${generatedPart.inlineData.mimeType};base64,${generatedPart.inlineData.data}`;
      return NextResponse.json({ imageUrl });
    } else {
      return NextResponse.json(
        { error: "The Pro model did not return an image part." },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Nano Banana Pro Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
