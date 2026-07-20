import json
import random
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neural_network import MLPClassifier
import os 


app = Flask(__name__)
CORS(app)

# Cargar dataset


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATASET = os.path.join(BASE_DIR, "dataset_entrenamiento.json")

with open(DATASET, "r", encoding="utf-8") as file:
    data = json.load(file)

X = []
y = []
responses = {}

for intent in data["intents"]:
    tag = intent["tag"]
    responses[tag] = intent["responses"]

    for pattern in intent["patterns"]:
        X.append(pattern.lower())
        y.append(tag)

# Vectorización

vectorizer = TfidfVectorizer(
    lowercase=True,
    strip_accents="unicode",
    ngram_range=(1, 2),
    max_features=1000
)

X_train = vectorizer.fit_transform(X)

# Entrenamiento

model = MLPClassifier(
    hidden_layer_sizes=(32, 16),
    activation="relu",
    solver="adam",
    learning_rate="adaptive",
    max_iter=800,
    random_state=42
)

model.fit(X_train, y)

score = model.score(X_train, y)

print("\n=========================================")
print("Modelo PoliRent entrenado correctamente")
print("=========================================")
print(f"Intenciones: {len(data['intents'])}")
print(f"Frases de entrenamiento: {len(X)}")
print(f"Precisión entrenamiento: {score*100:.2f}%")
print("=========================================\n")



# API

@app.route("/api/chat", methods=["POST"])
def chat():

    body = request.get_json()

    message = body.get("message", "").strip().lower()

    if message == "":
        return jsonify({
            "response": "No recibí ningún mensaje."
        })

    vector = vectorizer.transform([message])

    probabilities = model.predict_proba(vector)[0]

    best_index = probabilities.argmax()

    confidence = float(probabilities[best_index])

    intent = model.classes_[best_index]

    if confidence < 0.65:

        return jsonify({

            "response":
            "Lo siento, solo puedo responder preguntas relacionadas con PoliRent, alquileres, herramientas, pagos y devoluciones.",

            "metric_accuracy": confidence,

            "intent_detected": "DESCONOCIDO"

        })

    return jsonify({

        "response": random.choice(responses[intent]),

        "metric_accuracy": confidence,

        "intent_detected": intent

    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)