import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.efficientnet import preprocess_input

def prepare_image(img_path):
    """Converts a raw image file into a tensor for EfficientNet."""
    # 1. Load and Resize
    img = image.load_img(img_path, target_size=(224, 224))
    
    # 2. Convert to Array
    x = image.img_to_array(img)
    
    # 3. Add Batch Dimension (1, 224, 224, 3)
    x = np.expand_dims(x, axis=0)
    
    # 4. Apply EfficientNet Preprocessing (The 68% Accuracy Fix)
    return preprocess_input(x)