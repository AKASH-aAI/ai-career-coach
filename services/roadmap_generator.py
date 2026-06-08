import google.generativeai as genai
import os

API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_roadmap(career):

    prompt = f"""
    You are an expert career mentor.

    The predicted career is: {career}

    Generate a professional roadmap in clean HTML format.

    Include:

    <h2>Career Overview</h2>
    <h2>Required Skills</h2>
    <h2>Learning Path</h2>
    <h3>Beginner</h3>
    <h3>Intermediate</h3>
    <h3>Advanced</h3>
    <h2>Recommended Tools</h2>
    <h2>Projects To Build</h2>
    <h2>Certifications</h2>
    <h2>Interview Preparation</h2>
    <h2>Career Growth Opportunities</h2>

    Rules:
    - Return ONLY HTML.
    - No markdown.
    - Use h2, h3, p, ul, li tags.
    - Make the roadmap practical and actionable.
    """

    try:
        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        return f"<p>Error generating roadmap: {str(e)}</p>"