import os
from flask import Flask, render_template, request, redirect, url_for, session
from services.predictor import predict_career
from services.roadmap_generator import generate_roadmap
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Secret key for session management

FEATURE_NAMES = [
    "coding_interest",
    "mathematics_interest",
    "analytical_thinking",
    "problem_solving",
    "creativity",
    "communication_skills",
    "leadership",
    "attention_to_detail",
    "research_interest",
    "business_interest",
    "design_interest",
    "learning_new_technology",
    "teamwork",
    "independent_work",
    "risk_taking",
]

# Authentication decorator
def login_required(f):
    def decorated_function(*args, **kwargs):
        if "authenticated" not in session:
            return redirect(url_for("login"))
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        password = request.form.get("password")
        app_password = os.getenv("APP_PASSWORD")
        
        if password == app_password:
            session["authenticated"] = True
            return redirect(url_for("index"))
        else:
            return render_template("login.html", error="Incorrect Password")
    
    return render_template("login.html")

@app.route("/")
@login_required
def index():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
@login_required
def predict():
    try:
        feature_values = []
        for feature in FEATURE_NAMES:
            value = request.form.get(feature)
            if value is None or value == "":
                raise ValueError(f"Missing value for {feature}")
            feature_values.append(int(value))

        predicted_career = predict_career(*feature_values)
        roadmap = generate_roadmap(predicted_career)

        return render_template(
            "result.html", career=predicted_career, roadmap=roadmap
        )
    except Exception as e:
        error_message = f"An error occurred: {str(e)}"
        return render_template("result.html", error=error_message)

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(
        host="0.0.0.0",
        port=port
    )