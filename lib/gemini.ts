import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const geminiModel = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash'

export const geminiFlash = genAI.getGenerativeModel({ model: geminiModel })

export default genAI
