import os
import json
import re
import requests
from google import genai
from google.api_core import exceptions
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

class WorkoutEngine:
    def __init__(self):
        self.WGER_BASE = "https://wger.de/api/v2"
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        self.model_id = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    def get_vetted_exercises(self, equipment_ids):
        """Fetch real exercise data from Wger API filtered by equipment."""
        try:
            # Fetches 200 exercises instead of 20
            response = requests.get(f"{self.WGER_BASE}/exerciseinfo/?language=2&limit=200", timeout=10)
            if response.status_code != 200:
                return []
            
            all_ex = response.json().get('results', [])

            # Filter exercises that match the user's available equipment IDs
            return [e for e in all_ex if any(self._equipment_id(q) in equipment_ids for q in e.get('equipment', []))]
        except Exception as e:
            print(f"Wger API Error: {e}")
            return []

    def _equipment_id(self, equipment):
        if isinstance(equipment, dict):
            return equipment.get("id")
        return equipment

    def _english_translation(self, exercise):
        translations = exercise.get("translations", [])
        if not translations:
            return {}

        return next(
            (translation for translation in translations if translation.get("language") == 2),
            translations[0],
        )

    def _exercise_context_item(self, exercise):
        translation = self._english_translation(exercise)
        description = re.sub("<[^<]+?>", "", translation.get("description", ""))

        return {
            "name": translation.get("name", "Unnamed exercise"),
            "desc": description[:150],
        }
        
    muscle_groups = {
    "Shoulders": [2],
    "Arms": [1, 5, 13], # Biceps, Triceps, Brachialis
    "Chest": [4],
    "Back": [12, 9],    # Lats, Trapezius
    "Core": [6, 14, 3], # Abs, Obliques, Serratus
    "Legs": [10, 11, 8, 7, 15] # Quads, Hamstrings, Glutes, Calves
    }   

    def start_chat_session(self, profile):
        """Initialize Gemini chat with a personal trainer persona."""
        
        # Pull relevant exercises to give the AI context for the conversation
        vetted_data = self.get_vetted_exercises(profile['equipment_ids'])
        exercise_context = [self._exercise_context_item(e) for e in vetted_data]

        system_instruction = (
            "ROLE: You are a Certified Strength and Conditioning Specialist (CSCS) and AI Personal Trainer.\n"
            f"USER CONTEXT: Goal: {profile['goal']} | Experience: {profile.get('experience', 'Unknown')}.\n"
            f"INJURY DATA: {', '.join(profile['injuries']) if profile['injuries'] else 'None'}.\n"
            
            "STRICT SAFETY & MUSCLE GROUP RULES:\n"
            "1. If a user mentions an injury to a body part, you must cross-reference it with these muscle groups and AVOID corresponding exercises:\n"
            "- Shoulder Injury: Avoid Anterior deltoid (ID 2). No overhead pressing. Avoid heavy pressing or hanging. Suggest lower-impact movements. \n"
            "- Arm/Elbow Injury: Avoid Biceps (ID 1), Triceps (ID 5), and Brachialis (ID 13).\n"
            "- Chest Injury: Avoid Pectoralis major (ID 4). No heavy flyes or presses.\n"
            "- Back Injury: Avoid Lats (ID 12) and Trapezius (ID 9). No heavy rows or deadlifts. Avoid heavy spinal loading. Suggest core-bracing or supported movements.\n"
            "- Core/Ab Injury: Avoid Abs (ID 6) and Obliques (ID 14).\n"
            "- Leg/Knee/Hip Injury: Avoid Quads (ID 10), Hamstrings (ID 11), and Glutes (ID 8). Avoid jumping, heavy squats, or lunges. Suggest seated or glute-focused movements.\n"
            "You MUST NOT suggest exercises that put direct or heavy load on that specific joint or muscle group."
            "2. PAIN PROTOCOL: If the user reports pain during a chat, immediately stop that exercise and provide a 'Regression' (an easier, safer version).\n"
            
            "DATABASE CONSTRAINTS:\n"
            f"- You must prioritize these vetted exercises: {json.dumps(exercise_context)}.\n"
            "- If a vetted exercise conflicts with an injury, DISCARD IT and find a safer alternative.\n"
            
            "OUTPUT STYLE:\n"
            "- Be professional, concise, and encouraging.\n"
            "- Always provide Sets, Reps, and a 'Safety Cue' for every movement."
        )

        return self.client.chats.create(
            model=self.model_id,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction
            )
        )

    def apply_progression(self, difficulty, weight):
        """Progressive overload for exercises"""
        if difficulty <= 5: 
            return round(weight * 1.05, 1), "Strong performance! Increasing weight by 5%."
        if difficulty >= 9: 
            return weight, "High exertion detected. Maintain weight and focus on form."
        return weight, "Perfect intensity. Stay at this weight for next session."
