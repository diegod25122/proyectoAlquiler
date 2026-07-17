import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.neural_network import MLPClassifier

app = Flask(__name__)
CORS(app) # Permitir que tu frontend de React lo consuma sin problemas

# 1. Cargar las intenciones
with open('dataset_entrenamiento.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

X, y = [], []
responses = {}

for intent in data['intents']:
    tag = intent['tag']
    responses[tag] = intent['responses']
    for pattern in intent['patterns']:
        X.append(pattern.lower())
        y.append(tag)

# 2. Vectorizar texto y Entrenar el modelo de IA propio
vectorizer = CountVectorizer()
X_transformed = vectorizer.fit_transform(X)

# Red Neuronal Básica (Multi-Layer Perceptron)
model = MLPClassifier(hidden_layer_sizes=(16, 16), max_iter=500, random_state=42)
model.fit(X_transformed, y)

print("🎯 ¡Modelo de IA de PoliRent entrenado con éxito localmente!")

# 3. Endpoint de la API
@app.route('/api/chat', methods=['POST'])
def chat():
    user_message = request.json.get("message", "").lower()
    if not user_message:
        return jsonify({"response": "No recibí ningún mensaje."})
    
    # 1. Transformar el mensaje
    input_vector = vectorizer.transform([user_message])
    
    # 2. Obtener probabilidades de todas las etiquetas
    probabilities = model.predict_proba(input_vector)[0]
    max_prob_index = probabilities.argmax()
    max_probability = probabilities[max_prob_index] 
    
    predicted_tag = model.classes_[max_prob_index]
    
    # 3. Umbral de confianza estricto (65% mínimo de certeza)
    if max_probability < 0.65:
        reply = "Lo siento, soy la IA de PoliRent y solo puedo resolver dudas sobre el uso de la aplicación, requisitos de alquiler y plazos de devolución de herramientas. ¿Podrías replantear tu pregunta?"
        predicted_tag = "DESCONOCIDO"
    else:
        import random
        reply = random.choice(responses[predicted_tag])
    
    return jsonify({
        "response": reply,
        "metric_accuracy": float(max_probability),
        "intent_detected": predicted_tag
    })
if __name__ == '__main__':
    app.run(port=5000, debug=True)