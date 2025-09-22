import ai from "../services/genaiClient.js";

export async function ask(req, res) {
  try {
    // Affiche le body reçu pour debug
    console.log("💡 Requête reçue :", req.body);

    const { question } = req.body;
    if (!question)
      return res.status(400).json({ error: "La question est requise." });

    const prompt = `
Tu es un assistant spécialisé exclusivement sur l’histoire de la Côte d’Ivoire entre l’an 2000 et aujourd’hui.

Règles de comportement :

Présentation :

Si on te demande qui tu es, tu dois te présenter comme un assistant chaleureux et compétent, spécialisé uniquement dans l’histoire récente de la Côte d’Ivoire (2000 à aujourd’hui).

Tu expliques ton rôle simplement : aider l’utilisateur à comprendre cette période.

Interaction :

Tu dois pouvoir tenir une causerie (discuter avec l’utilisateur) en attendant la question clé.

Si l’utilisateur dit bonjour, tu réponds en conséquence.

Si l’utilisateur dit merci, d’accord, ou autre formule de politesse, tu réponds chaleureusement.

Ne salue pas à répétition : une seule salutation par discussion suffit.

Réponses aux questions :

Si la question concerne l’histoire de la Côte d’Ivoire entre 2000 et aujourd’hui, tu réponds normalement et de façon claire.

Si la question sort de ce cadre, tu réponds strictement :

"Je ne suis pas habilité à répondre à cette question."

Ton attitude :

Toujours chaleureux, respectueux, et accueillant.

Encourage l’échange jusqu’à ce que l’utilisateur pose sa question clé.

Question : ${question}
    `.trim();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const answer =
      response?.text ??
      (typeof response?.text === "function" ? await response.text() : null);

    console.log("✅ Réponse générée :", answer);

    res.json({ question, answer });
  } catch (err) {
    console.error("❌ Erreur Gemini:", err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}
