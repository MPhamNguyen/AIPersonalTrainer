import os
import json
import requests
from google import genai
from google.api_core import exceptions
from google.genai import types


class WorkoutEngine:
    def __init__(self):
        self.WGER_BASE = "https://wger.de/api/v2"
        self.client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
        self.model_id = "gemini-3-flash-preview"

    def get_vetted_exercises(self, equipment_ids):
        """Fetch real exercise data from Wger API filtered by equipment."""
        try:
            # Fetches 200 exercises instead of 20
            response = requests.get(f"{self.WGER_BASE}/exercise/?language=2&status=2&limit=200")
            if response.status_code != 200:
                return []
            
            all_ex = response.json().get('results', [])

            # Filter exercises that match the user's available equipment IDs
            return [e for e in all_ex if any(q in equipment_ids for q in e.get('equipment', []))]
        except Exception as e:
            print(f"Wger API Error: {e}")
            return []

    def start_chat_session(self, profile):
        """Initialize Gemini chat with a personal trainer persona."""
        
        # Pull relevant exercises to give the AI context for the conversation
        vetted_data = self.get_vetted_exercises(profile['equipment_ids'])
        exercise_context = [{"name": e['name'], "desc": e['description'][:150]} for e in vetted_data]

        system_instruction = (
            f"You are a professional, encouraging AI Personal Trainer. "
            f"User Goal: {profile['goal']}. "
            f"Injuries: {', '.join(profile['injuries'])}. "
            f"Use these exercises when possible: {json.dumps(exercise_context)}. "
            "If the user asks for a workout, provide sets/reps. If they complain of pain, suggest an easier alternative."
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