import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const gradePracticalTask = async (taskTitle: string, taskDesc: string, userAnswer: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Сен - "AI-teach" платформасының қатал, бірақ әділ педагог сарапшысысың. 
    Мақсатың: мұғалімнің практикалық тапсырманы орындау сапасын мұқият, академиялық тұрғыдан тексеру.

    Тапсырма контексті:
    Атауы: ${taskTitle}
    Сипаттамасы: ${taskDesc}
    
    Мұғалімнің жауабы: "${userAnswer}"

    Сен келесі критерийлер бойынша қатаң бағалауың керек:
    1. Мазмұнның сәйкестігі: Жауап тапсырманың негізгі сұрағына толық жауап бере ме? (0-30 ұпай)
    2. Әдістемелік тереңдік: Педагогикалық немесе техникалық терминдер мен ұғымдар дұрыс қолданылған ба? Жауап үстірт емес пе? (0-30 ұпай)
    3. Практикалық құндылық: Ұсынылған шешімді нақты сабақта қолдану мүмкін бе? Ол пайдалы ма? (0-20 ұпай)
    4. Көлем және сапа: Жауаптың көлемі мен сапасы мұғалімнің деңгейіне сай ма? (0-20 ұпай)

    Жауапты келесі JSON форматында қайтар:
    {
      "score": 0-100 аралығындағы нақты ұпай,
      "feedback": "Нақты талдау (қазақ тілінде).",
      "detailed_analysis": {
        "pros": ["Жақсы шыққан 2-3 тұс"],
        "cons": ["Жақсартуды қажет ететін 2-3 тұс"],
        "suggestions": ["Нақты 1-2 практикалық кеңес"]
      },
      "status": "completed" немесе "failed" (ұпай 60-тан төмен болса - failed, 60 және жоғары - completed)
    }

    МАҢЫЗДЫ ЕРЕЖЕЛЕР:
    - Кері байланыста "тапсырманың критерийлеріне" тікелей сілтеме жаса.
    - Мысалы: "Әдістемелік тұрғыдан [термин] дұрыс қолданылған, бірақ [мысал] жетіспейді".
    - Егер жауап тым қысқа (мысалы 1-5 сөз), немесе тақырыпқа мүлдем қатысы жоқ болса, 20-дан төмен ұпай беріп, статусқа "failed" қой.
    - Жауапта "білмеймін", "орындадым" немесе мағынасыз сөздер болса, бірден "failed" бер.
    - Бағалау өте әділ және нақты болуы керек. Сапасыз жауапқа жоғары ұпай берме.
    - Тек таза JSON жібер, артық түсініктемесіз.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Improved JSON extraction
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("AI Grading error:", error);
    return {
      score: 0,
      feedback: "Жауапты талдау кезінде техникалық қате кетті. Жауабыңызды толықтырып, қайта жіберіп көріңіз.",
      status: "failed"
    };
  }
};
