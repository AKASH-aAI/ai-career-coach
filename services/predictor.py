
import joblib
import pandas as pd 

# load train model and encoder 

model = joblib.load("models/career_model.pkl")
encoder = joblib.load("models/label_encoder.pkl")

def predict_career(
    coding_interest,
    mathematics_interest,
    analytical_thinking,
    problem_solving,
    creativity,
    communication_skills,
    leadership,
    attention_to_detail,
    research_interest,
    business_interest,
    design_interest,
    learning_new_technology,
    teamwork,
    independent_work,
    risk_taking
):

    data = pd.DataFrame([{
        "Coding_Interest": coding_interest,
        "Mathematics_Interest": mathematics_interest,
        "Analytical_Thinking": analytical_thinking,
        "Problem_Solving": problem_solving,
        "Creativity": creativity,
        "Communication_Skills": communication_skills,
        "Leadership": leadership,
        "Attention_To_Detail": attention_to_detail,
        "Research_Interest": research_interest,
        "Business_Interest": business_interest,
        "Design_Interest": design_interest,
        "Learning_New_Technology": learning_new_technology,
        "Teamwork": teamwork,
        "Independent_Work": independent_work,
        "Risk_Taking": risk_taking
    }])

    prediction = model.predict(data)

    career = encoder.inverse_transform(prediction)

    return career[0] 