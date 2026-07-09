import 'dotenv/config';
import express from "express";
import cors from "cors";
import { readFileSync } from "fs";

const FALLBACK_GEMINI = 'AQ.Ab8RN6KoH9k90rhFL5hnNJR6FpwdGx7ipnZ4iBeJ7Fq1vJO73A';
const FALLBACK_EXERCISEDB = 'afa374326emsh8393b172e68e2d2p18d5aejsn4a789c43bb5d';

const exerciseMapping = JSON.parse(readFileSync(new URL("./exerciseMapping.json", import.meta.url), "utf-8"));

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post("/api/tdee", (req, res) => {
  const { age, gender, height, weight, activityLevel, goalType, dietPref } = req.body;

  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const activityMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
  };

  const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);

  const goalAdjustments = {
    lose_fat: -500,
    build_muscle: 300,
    maintain: 0,
    body_recomp: 0,
  };

  const adjustedCalories = tdee + (goalAdjustments[goalType] || 0);

  res.json({ bmr, tdee, adjustedCalories });
});

app.post("/api/scan-food", async (req, res) => {
  const { image } = req.body;
  if (!image) return res.json({ ok: false, error: "No image provided" });

  try {
    const apiKey = (process.env.GEMINI_API_KEY || FALLBACK_GEMINI);
    if (!apiKey) return res.json({ ok: false, error: "API key not configured" });

    const prompt = `You are a professional nutritionist specializing in Indian cuisine. Analyze this food photo thoroughly with deep knowledge of Indian dishes, ingredients, and cooking methods.

IDENTIFY INDIAN FOODS ACCURATELY:
- Know the difference between dal tadka, dal makhani, sambhar, rasam — don't just call everything "lentil curry"
- Distinguish roti/chapati/naan/paratha/bhakri/puri based on visual thickness, oil sheen, and size
- Recognize subzis (sabzi) by their main vegetable — "Aloo Gobi" not just "vegetable curry"
- Identify rice dishes: plain steamed rice, biryani (layered with protein), lemon rice, jeera rice, curd rice
- Spot common combinations: dal-chawal, roti-sabzi, dosa-sambar, idli-sambar, thali meals
- Account for ghee, oil tadka, coconut-based gravies, yogurt/curd, cream-based gravies
- Know street foods: samosa, vada pav, pav bhaji, chaat, kachori, bhel puri

For each item provide:
1. Portion — use Indian measures: katori (bowl), phulka/roti (piece), plate (thali), glass (tumbler)
2. Cooking method — tadka (tempering), bhuna (slow sauté), dum (steam), tawa (griddle), tandoor (clay oven), deep-fried
3. Ingredients — be specific: "Dal Tadka (toor dal, ghee, cumin, garlic, tomato)" not just "lentils"
4. Estimate calories/macros factoring in typical Indian cooking: generous oil/ghee use in restaurant food, dals are protein+carb, rotis are whole wheat, rice is simple carb

Be specific: "Butter Chicken (murgh makhani) — 2 pieces" not "chicken curry", "Plain Dosa" vs "Masala Dosa" vs "Rava Dosa".

Return ONLY this JSON array (no markdown, no backticks, no extra text):
[{"food_name":"...","quantity":1,"unit":"serving","calories":0,"protein_g":0,"carbs_g":0,"fat_g":0}]

- quantity must be a number
- unit: katori, piece, roti, plate, cup, bowl, tbsp, glass, slice
- Estimate conservatively — slightly under-guess rather than over-guess calories
- If the image is a single item, return one object
- If the image has no recognizable food, return [{"food_name":"Unknown","quantity":1,"unit":"serving","calories":0}]`;

    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: "image/jpeg", data: image } },
            { text: prompt },
          ],
        }],
      }),
    });

    const text = await geminiRes.text();
    if (!geminiRes.ok) return res.json({ ok: false, error: text });

    const result = JSON.parse(text);
    const reply = result.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const cleaned = reply.replace(/```json|```/g, "").trim();
    const items = JSON.parse(cleaned);

    if (!Array.isArray(items) || items.length === 0) {
      return res.json({ ok: false, error: "Could not identify food" });
    }

    const normalized = items.map(item => ({
      food_name: item.food_name || "Unknown",
      quantity: Number(item.quantity) || 1,
      unit: item.unit || "serving",
      calories: Number(item.calories) || 0,
      protein_g: Number(item.protein_g) || 0,
      carbs_g: Number(item.carbs_g) || 0,
      fat_g: Number(item.fat_g) || 0,
    }));

    res.json({ ok: true, items: normalized });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

async function fetchExerciseById(apiKey, id) {
  const url = `https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`;
  const apiRes = await fetch(url, {
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
    },
  });
  const text = await apiRes.text();
  if (!apiRes.ok) return null;
  return JSON.parse(text);
}

function normalizePlan(plan) {
  let days;
  if (plan && plan.days) {
    days = plan.days.map(d => ({
      day: typeof d.day === 'string' ? parseInt(d.day.replace(/\D/g, '')) || 1 : d.day || 1,
      focus: d.focus || 'Full Body',
      warmup: d.warmup || [],
      exercises: (d.exercises || []).map(e => ({
        name: e.name,
        sets: e.sets || 3,
        reps: e.reps || '10',
        muscleGroup: e.muscleGroup || '',
        difficulty: 'beginner',
        rest: e.restSeconds || 60,
        notes: e.progressionNote || e.weightGuidance || '',
      })),
      cooldown: d.cooldown || [],
      isRestDay: d.isRestDay || false,
    }));
  } else if (Array.isArray(plan)) {
    days = plan.map(d => ({
      ...d,
      day: typeof d.day === 'string' ? parseInt(d.day.replace(/\D/g, '')) || 1 : d.day || 1,
      warmup: d.warmup || [],
      cooldown: d.cooldown || [],
      exercises: (d.exercises || []).map(e => ({
        name: e.name,
        sets: e.sets || 3,
        reps: e.reps || '10',
        muscleGroup: e.muscleGroup || '',
        difficulty: e.difficulty || 'beginner',
        rest: e.restSeconds || e.rest || 60,
        notes: e.progressionNote || e.notes || e.weightGuidance || '',
      })),
      isRestDay: d.isRestDay || false,
    }));
  }
  return days;
}

app.post("/api/generate-workout-plan", async (req, res) => {
  const { name, age, gender, bodyType, weight, height, activityLevel, injuries, goalType, gymType, gymExp } = req.body;
  const apiKey = (process.env.GEMINI_API_KEY || FALLBACK_GEMINI);
  if (!apiKey) return res.json({ ok: false, error: "API key not configured" });

  const goalLabel = { lose_fat: 'fat loss', build_muscle: 'muscle gain', maintain: 'general fitness', body_recomp: 'body recomposition' };
  const bodyMap = { athlete: 'lean, athletic build — low body fat, visible definition', vtaper: 'broad shoulders, narrow waist — classic V-shape physique', bulky: 'big, dense frame — mass and strength focused', cat: 'slim with curves (cat)', butterfly: 'flexibility + mobility (fox)', swan: 'long lean graceful (swan)', tigress: 'strong curves athletic (tigress)' };

  const prompt = `SYSTEM:
You are Fitcal's AI workout programming engine. You generate safe, structured 7-day workout plans for beginners. Output ONLY valid JSON, no markdown, no commentary, no preamble.

USER:
Generate a 7-day beginner workout plan based on this user profile:

- Goal: ${goalLabel[goalType] || 'general fitness'}
- Body type archetype: ${bodyMap[bodyType] || bodyType || 'balanced'}
- Age: ${age || '25'}
- Height: ${height || '170'} cm
- Weight: ${weight || '70'} kg
- Experience level: beginner (first plan, no history)
- Equipment available: ${gymType || 'moderate'}
- Injuries/limitations: ${injuries || 'None'}

RULES:
1. This is the user's FIRST plan — assume zero training history. Use conservative starting weights (or bodyweight/light load) and moderate volume (3 sets x 8-12 reps for most movements).
2. Include 1-2 rest or active-recovery days within the 7 days.
3. Tailor exercise selection and intensity to the body type archetype's typical strengths/focus areas.
4. Each exercise must include a short, literal "videoPrompt" string describing the movement for AI video generation (camera angle neutral, describe form only, no names/brands).
5. Do not include any text outside the JSON object.
${injuries && injuries !== 'None' ? `6. CRITICAL: Avoid any exercises that strain: ${injuries}` : ''}

OUTPUT JSON SCHEMA:
{
  "planMeta": {
    "weekNumber": 1,
    "goal": "${goalLabel[goalType] || 'general fitness'}",
    "bodyType": "${bodyType || 'balanced'}",
    "experienceLevel": "beginner"
  },
  "days": [
    {
      "day": "Day 1",
      "focus": "Full Body A",
      "isRestDay": false,
      "exercises": [
        {
          "name": "Exercise Name",
          "sets": 3,
          "reps": "8-12",
          "weightGuidance": "bodyweight or light ~5kg dumbbells",
          "restSeconds": 60,
          "videoPrompt": "Standing neutral camera, show full movement from start to finish"
        }
      ]
    }
  ]
}`;

  try {
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    const text = await geminiRes.text();
    if (!geminiRes.ok) return res.json({ ok: false, error: text });

    const result = JSON.parse(text);
    const reply = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleaned = reply.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    const days = normalizePlan(parsed);

    if (!days || days.length === 0) {
      return res.json({ ok: false, error: "Invalid plan format" });
    }

    res.json({ ok: true, plan: days });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

app.get("/api/exercise-details/:name", async (req, res) => {
  const { name } = req.params;
  const apiKey = (process.env.EXERCISEDB_API_KEY || FALLBACK_EXERCISEDB);
  if (!apiKey) return res.json({ ok: false, error: "API key not configured" });

  try {
    let ex = null;

    const mappedId = exerciseMapping[name];
    if (mappedId) {
      ex = await fetchExerciseById(apiKey, mappedId);
    }

    if (!ex) {
      const url = `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(name)}`;
      const apiRes = await fetch(url, {
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        },
      });
      const text = await apiRes.text();
      if (apiRes.ok) {
        const exercises = JSON.parse(text);
        if (exercises && exercises.length > 0) {
          ex = exercises[0];
        }
      }
    }

    if (!ex) return res.json({ ok: false, error: "No results" });

    res.json({
      ok: true,
      name: ex.name,
      id: ex.id,
      bodyPart: ex.bodyPart,
      target: ex.target,
      equipment: ex.equipment,
      secondaryMuscles: ex.secondaryMuscles || [],
      instructions: ex.instructions || [],
    });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

app.get("/api/exercise-image/:id", async (req, res) => {
  const apiKey = (process.env.EXERCISEDB_API_KEY || FALLBACK_EXERCISEDB);
  if (!apiKey) return res.status(500).end();
  try {
    const imgRes = await fetch(`https://exercisedb.p.rapidapi.com/image?exerciseId=${req.params.id}&resolution=180`, {
      headers: { "X-RapidAPI-Key": apiKey, "X-RapidAPI-Host": "exercisedb.p.rapidapi.com" },
    });
    if (!imgRes.ok) return res.status(imgRes.status).end();
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    res.set("Content-Type", imgRes.headers.get("content-type") || "image/gif");
    res.send(buffer);
  } catch { res.status(500).end(); }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`FitX server running on port ${PORT}`));
