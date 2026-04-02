from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    message: str
    fieldContext: Optional[str] = ""
    language: str = "en"

