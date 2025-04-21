import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a car expert. For each car suggestion, provide ONLY 2025 model year cars in this format: 'Make Model - 2025' followed by a brief summary of its key features, pricing, and specifications on a new line. Separate each car suggestion with '---'. For example:\nToyota Camry - 2025\nRedesigned midsize sedan with 2.5L hybrid powertrain, advanced driver assistance, digital cockpit, and estimated 45 MPG combined. Starting at $28,500.\n---",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const text = response.choices[0].message?.content || "";
    const cars = text
      .split("---")
      .filter(Boolean)
      .map((car) => {
        const [firstLine, ...summaryLines] = car.trim().split("\n");
        return {
          fullDescription: firstLine.trim(),
          summary: summaryLines.join("\n").trim(),
          searchQuery: firstLine.split(" - ")[0].trim(), // for image search
        };
      });

    return NextResponse.json({ cars });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: "Failed to get car suggestions" },
      { status: 500 }
    );
  }
}
