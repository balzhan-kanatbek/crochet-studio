import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const color = formData.get('color') as string;

    if (!image || !color) {
      return NextResponse.json(
        { error: 'Missing image or color' },
        { status: 400 }
      );
    }

    // Load the default crochet design image
    const designImagePath = path.join(process.cwd(), 'public', 'crochet-design.jpg');
    const designImageBuffer = fs.readFileSync(designImagePath);
    const designBase64 = designImageBuffer.toString('base64');

    // Convert user's image to base64
    const arrayBuffer = await image.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'imagen-3.0-generate-001' });

    // Generate content with image and prompt
    const content = [
      `Generate an image of this person wearing a ${color} crochet bandana with the specific crochet pattern shown in the reference image. Use only this exact pattern for the bandana design.`,
      {
        inlineData: {
          mimeType: image.type,
          data: base64,
        },
      },
      `Reference crochet pattern:`,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: designBase64,
        },
      },
    ];

    const result = await model.generateContent(content);

    const response = await result.response;
    const candidates = response.candidates;

    if (candidates && candidates.length > 0 && candidates[0].content) {
      const parts = candidates[0].content.parts;

      if (parts && parts.length > 0 && parts[0].inlineData) {
        const imageData = parts[0].inlineData;
        const imageUrl = `data:${imageData.mimeType};base64,${imageData.data}`;
        return NextResponse.json({ imageUrl });
      } else {
        return NextResponse.json(
          { error: 'Failed to generate image' },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'No candidates in response' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in generate API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}