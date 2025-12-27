import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai"; 
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

    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });

    const designImagePath = path.join(
      process.cwd(),
      "public",
      "crochet-design.jpg"
    );
    const designBase64 = fs.readFileSync(designImagePath).toString("base64");

    const userBuffer = await userImage.arrayBuffer();
    const userBase64 = Buffer.from(userBuffer).toString("base64");

    const promptText = `Perform a strict in-painting operation on the provided photograph of the person (image 2).
  - BASE IMAGE CONSTRAINT: The original image of the person is the immutable base layer. Their facial features, identity, skin texture, hair color/style, clothing, and the background MUST NOT BE ALTERED.
  - PRIMARY TASK: Generate a single handmade crochet bandana (using stitch pattern from image 1, color ${color}) and layer it realistically onto the head.
  - PLACEMENT RULES: The bandana sits on the crown of the head, further back from the forehead. The front section of hair and the natural part must remain visible *in front* of the bandana.
  - INTEGRATION: The crochet fabric should appear to sit upon and slightly compress the hair underneath it. Only generate the pixels necessary for the bandana itself and the immediate shadows it casts on the hair.
  - NEGATIVE CONSTRAINT: Do not regenerate the face. Do not add anything to the neck or collar area.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview", 
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: designBase64,
                mimeType: "image/jpeg",
              },
            }, 
            { inlineData: { data: userBase64, mimeType: userImage.type } }, 
            { text: promptText },
          ],
        },
      ],
      config: {
        responseModalities: ["IMAGE"], 
      },
    });

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
