from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict
import uvicorn
from engine import WorkoutEngine
import requests

app = FastAPI(title="AI Personal Trainer")
engine = WorkoutEngine()

class UserOnboard(BaseModel):
    user_id: int
    goal: str
    injuries: List[str]
    equipment_ids: List[int] 

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "user_id": 0,
                    "goal": "Fat Loss",
                    "injuries": ["none"],
                    "equipment_ids": [3, 7]
                }
            ]
        }
    }

class ChatInput(BaseModel):
    message: str = Field(..., example="Can you give me a dumbbell-only chest workout?")

class LogEntry(BaseModel):
    name: str
    weight: float
    difficulty: int

user_db: Dict[int, dict] = {}
active_chats = {}

@app.get("/equipmentList")
async def get_equipment_list():
    """Returns a list of equipment names and IDs"""
    try:
        response = requests.get("https://wger.de/api/v2/equipment/")
        if response.status_code == 200:
            #Filter and create a list of required vals (id/name)
            data = response.json().get('results', [])
            return [{"id": item['id'], "name": item['name']} for item in data]
        return {"error": "Could not reach wger database"}
    except Exception as e:
        return {"error": str(e)}
    
@app.get("/muscleList")
async def get_muscle_list():
    """Returns a list of muscle names and IDs"""
    try:
        response = requests.get("https://wger.de/api/v2/muscle/")
        if response.status_code == 200:
            #Filter and create a list of required vals (id/name)
            data = response.json().get('results', [])
            return [{"id": item['id'], "name": item['name']} for item in data]
        return {"error": "Could not reach wger database"}
    except Exception as e:
        return {"error": str(e)}

@app.post("/createAccount")
async def onboard_user(user: UserOnboard):
    """Saves the user profile to memory."""
    user_db[user.user_id] = user.dict()
    # Reset chat session if user updates profile
    if user.user_id in active_chats:
        del active_chats[user.user_id]
    return {"message": f"Profile for User {user.user_id} saved successfully."}

@app.post("/chat/{user_id}")
async def chat(user_id: int, payload: ChatInput):
    if user_id not in user_db:
        raise HTTPException(status_code=404, detail="User not found. Please onboard first.")

    if user_id not in active_chats:
        profile = user_db[user_id]
        active_chats[user_id] = engine.start_chat_session(profile)

    try:
        session = active_chats[user_id]
        response = session.send_message(payload.message)
        return {
            "trainer_reply": response.text,
            "status": "active"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/track-progress/{user_id}")
async def track_progress(user_id: int, logs: List[LogEntry]):
    """Take in user feedback out of workout and suggests progression"""
    results = []
    for entry in logs:
        next_weight, coach_note = engine.apply_progression(entry.difficulty, entry.weight)
        results.append({
            "exercise": entry.name,
            "next_weight": next_weight,
            "note": coach_note
        })
    return {"report": results}

@app.delete("/chat/{user_id}")
async def reset_chat(user_id: int):
    """Clears the conversation history."""
    if user_id in active_chats:
        del active_chats[user_id]
    return {"message": "Chat history cleared."}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)