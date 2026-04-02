import os
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications.efficientnet import preprocess_input
from sklearn.metrics import classification_report

# 1. PATHS - Adjusted for your VS Code structure
MODEL_PATH = "models/agrimit_v2_production.h5"
TEST_DATA_PATH = "test_data/" # Put a few class folders here for the demo

if not os.path.exists(MODEL_PATH):
    print(f"❌ Error: Model not found at {MODEL_PATH}")
    exit()

# 2. LOAD
print("📦 Loading Production Model...")
model = tf.keras.models.load_model(MODEL_PATH)

# 3. GENERATOR
test_datagen = ImageDataGenerator(preprocessing_function=preprocess_input)
test_gen = test_datagen.flow_from_directory(
    TEST_DATA_PATH,
    target_size=(224, 224),
    batch_size=32,
    class_mode='categorical',
    shuffle=False
)

# 4. EVALUATE
print("🔍 Running Matrix Evaluation...")
predictions = model.predict(test_gen)
y_pred = np.argmax(predictions, axis=1)
y_true = test_gen.classes

report = classification_report(
    y_true, 
    y_pred, 
    target_names=list(test_gen.class_indices.keys()),
    zero_division=0
)

print("\n--- LIVE PERFORMANCE MATRIX ---")
print(report)