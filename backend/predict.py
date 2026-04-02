import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.efficientnet import preprocess_input
from .model_handler import load_agrimit_model # Imports your loader

# 1. Initialize the model once
model = load_agrimit_model()

# 2. Paste your 38 class names here (Exactly as they appeared in Colab)
CLASS_NAMES = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 
    'Apple___healthy', 'Blueberry___healthy', '...', 'Tomato___healthy'
]

def run_inference(img_path):
    """Takes an image path and returns (Disease Name, Confidence Score)."""
    # Load and Resize to 224x224 (EfficientNet standard)
    img = image.load_img(img_path, target_size=(224, 224))
    
    # Image to Array conversion
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    
    # CRITICAL: Apply the EfficientNet Preprocessing (The 68% Fix!)
    x = preprocess_input(x)
    
    # Predict
    predictions = model.predict(x)
    result_index = np.argmax(predictions)
    confidence = np.max(predictions) * 100
    
    return CLASS_NAMES[result_index], confidence