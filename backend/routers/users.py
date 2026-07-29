from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from database import get_db
from auth import get_password_hash, verify_password, create_access_token, require_auth

router = APIRouter(prefix="/api/users", tags=["Users"])

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    full_name: str = ""

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/register")
def register(data: RegisterRequest):
    db = get_db()
    cur = db.cursor()
    try:
        cur.execute(
            "INSERT INTO users (username, email, hashed_password, full_name) VALUES (?,?,?,?)",
            (data.username, data.email, get_password_hash(data.password), data.full_name)
        )
        db.commit()
        user_id = cur.lastrowid
        token = create_access_token({"sub": data.username, "id": user_id, "role": "user"})
        return {"access_token": token, "token_type": "bearer", "username": data.username, "role": "user"}
    except Exception as e:
        raise HTTPException(400, f"Registration failed: {str(e)}")
    finally:
        db.close()

@router.post("/login")
def login(data: LoginRequest):
    db = get_db()
    cur = db.cursor()
    user = cur.execute("SELECT * FROM users WHERE username=?", (data.username,)).fetchone()
    db.close()
    if not user or not verify_password(data.password, user["hashed_password"]):
        raise HTTPException(401, "Invalid credentials")
    token = create_access_token({"sub": user["username"], "id": user["id"], "role": user["role"]})
    return {
        "access_token": token, "token_type": "bearer",
        "username": user["username"], "role": user["role"], "full_name": user["full_name"]
    }

@router.get("/profile")
def get_profile(current_user=Depends(require_auth)):
    db = get_db()
    user = db.execute("SELECT id,username,email,full_name,role,created_at FROM users WHERE username=?",
                      (current_user["sub"],)).fetchone()
    db.close()
    if not user:
        raise HTTPException(404, "User not found")
    return dict(user)

@router.get("/all")
def get_all_users(current_user=Depends(require_auth)):
    if current_user.get("role") != "admin":
        raise HTTPException(403, "Admin only")
    db = get_db()
    users = db.execute("SELECT id,username,email,full_name,role,created_at FROM users").fetchall()
    db.close()
    return [dict(u) for u in users]
