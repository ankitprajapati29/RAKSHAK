import { createWorker } from 'tesseract.js'

export interface OcrResult {
  text: string
}

let worker: Awaited<ReturnType<typeof createWorker>> | null = null

async function getWorker() {
  if (!worker) {
    const baseUrl = window.location.origin

    worker = await createWorker(
      ['eng', 'hin'],
      1,
      {
        workerPath: `${baseUrl}/tesseract/worker.min.js`,
        langPath: `${baseUrl}/tesseract/lang`,
        corePath: `${baseUrl}/tesseract/core`,
        workerBlobURL: false,
        gzip: false,
      },
    )
  }

  return worker
}

export async function extractTextFromImage(
  image: File | Blob,
): Promise<OcrResult> {
  const ocrWorker = await getWorker()

  const result = await ocrWorker.recognize(image)

  return {
    text: result.data.text.trim(),
  }
}

export async function terminateOcrWorker(): Promise<void> {
  if (worker) {
    await worker.terminate()
    worker = null
  }
}
