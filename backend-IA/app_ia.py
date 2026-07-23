import json
import random
import os

from flask import Flask, request, jsonify
from flask_cors import CORS
from flasgger import Swagger
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neural_network import MLPClassifier

app = Flask(__name__)
CORS(app)

# swagger


swagger_template = {
    "openapi": "3.0.0",
    "info": {
        "title": "POLIRENT IA API",
        "description": "API del chatbot inteligente de PoliRent",
        "version": "1.0.0"
    },
    "servers": [
        {
            "url": "http://localhost:5000",
            "description": "Servidor Local"
        },
        {
            "url": "https://polirent-backendia.onrender.com",
            "description": "Servidor Producción"
        }
    ]
}

swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": "apispec",
            "route": "/apispec.json",
            "rule_filter": lambda rule: True,
            "model_filter": lambda tag: True
        }
    ],
    "swagger_ui": True,
    "specs_route": "/api-docs/"
}

Swagger(app, template=swagger_template, config=swagger_config)


# CARGAR DATASET


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


# VECTORIZACIÓN


vectorizer = TfidfVectorizer(
    lowercase=True,
    strip_accents="unicode",
    ngram_range=(1, 2),
    max_features=1000
)

X_train = vectorizer.fit_transform(X)


# ENTRENAMIENTO

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

print("\n========================================")
print("Modelo PoliRent entrenado correctamente")
print("========================================")
print(f"Intenciones: {len(data['intents'])}")
print(f"Frases entrenamiento: {len(X)}")
print(f"Precisión: {score*100:.2f}%")
print("========================================\n")


# API CHAT

@app.route("/api/chat", methods=["POST"])
def chat():
    """
    Chatbot Inteligente PoliRent
    ---
    tags:
      - Chatbot IA

    summary: Envía un mensaje al chatbot

    description: |
      Recibe una pregunta del usuario y responde utilizando el modelo entrenado.

    consumes:
      - application/json

    produces:
      - application/json

    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - message
          properties:
            message:
              type: string
              example: ¿Cómo alquilo una herramienta?

    responses:

      200:
        description: Respuesta del chatbot
        schema:
          type: object
          properties:

            response:
              type: string
              example: Para alquilar una herramienta debes iniciar sesión.

            metric_accuracy:
              type: number
              example: 0.95

            intent_detected:
              type: string
              example: alquiler
    """

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

            "response": "Lo siento, solo puedo responder preguntas relacionadas con PoliRent, alquileres, herramientas, pagos y devoluciones.",

            "metric_accuracy": confidence,

            "intent_detected": "DESCONOCIDO"

        })

    return jsonify({

        "response": random.choice(responses[intent]),

        "metric_accuracy": confidence,

        "intent_detected": intent

    })

#main


if __name__ == "__main__":

    port = int(os.environ.get("PORT", 5000))

    print("========================================")
    print(f"Servidor iniciado en puerto {port}")
    print(f"Swagger: http://localhost:{port}/api-docs")
    print("========================================")

    app.run(host="0.0.0.0", port=port)