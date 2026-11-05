"""Haunted Guestbook API: ghosts leave messages, the living read them."""
from datetime import datetime, timezone
from itertools import count

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="Haunted Guestbook")

_ids = count(1)
_entries: list[dict] = []


def _add(name: str, message: str) -> dict:
    entry = {
        "id": next(_ids),
        "name": name,
        "message": message,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    _entries.append(entry)
    return entry


_add("The Headless Horseman", "Lost my head again. Has anyone seen it?")
_add("Casper", "Friendly ghost here. Please stop screaming.")


class NewEntry(BaseModel):
    name: str = Field(min_length=1, max_length=40)
    message: str = Field(min_length=1, max_length=200)


@app.get("/")
def root():
    return {"status": "alive", "entries": len(_entries)}


@app.get("/health")
def health():
    return {"ok": True}


@app.get("/api/entries")
def list_entries():
    return list(reversed(_entries))


@app.post("/api/entries", status_code=201)
def create_entry(body: NewEntry):
    return _add(body.name.strip(), body.message.strip())


@app.delete("/api/entries/{entry_id}", status_code=204)
def delete_entry(entry_id: int):
    for i, e in enumerate(_entries):
        if e["id"] == entry_id:
            _entries.pop(i)
            return
    raise HTTPException(status_code=404, detail="That ghost already moved on")
