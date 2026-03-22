import { createWorker } from "tesseract.js";

export async function extractImageText(file: File): Promise<string> {
  const worker = await createWorker("eng");
  const imageUrl = URL.createObjectURL(file);

  try {
    const result = await worker.recognize(imageUrl);
    return result.data.text ?? "";
  } finally {
    URL.revokeObjectURL(imageUrl);
    await worker.terminate();
  }
}