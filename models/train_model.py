import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib


df = pd.read_csv(r"C:\Users\wardo\Downloads\projects\AI career coach\dataset\career_dataset.csv")


X = df.drop("Career", axis=1)
y = df['Career']

encoder = LabelEncoder()

y = encoder.fit_transform(y)

X_train , X_test , y_train , y_test = train_test_split(
    X,y,test_size=0.2,random_state=42,stratify=y
)

model = RandomForestClassifier(
    n_estimators=500,
    max_depth=15,
    min_samples_split=2,
    min_samples_leaf=1,
    random_state=42
)

model.fit(X_train,y_train)

y_pred = model.predict(X_test)

print('accuracy score :',accuracy_score(y_test,y_pred))

joblib.dump(model, "models/career_model.pkl")
joblib.dump(encoder, "models/label_encoder.pkl")

print("Model Saved Successfully")
