// service qui initialise le client GenAI
import { GoogleGenAI } from "@google/genai";

// Le client récupère la variable d'environnement GEMINI_API_KEY automatiquement
const ai = new GoogleGenAI({});
export default ai;
