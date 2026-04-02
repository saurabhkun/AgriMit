import cv2
import numpy as np
import io

def check_image_quality(image_bytes: bytes) -> tuple[bool, str]:
    """
    Stage 02: Preprocessing - Layer 1 Quality Check.
    Validates crop image quality based on blur and exposure.
    """
    try:
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None:
            return False, "Invalid image format. Please upload JPEG/PNG."

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # 1. BLUR CHECK (Laplacian Variance)
        # Requirement: Reject images below threshold with specific message
        blur_variance = cv2.Laplacian(gray, cv2.CV_64F).var()
        if blur_variance < 100:
            return False, f"Image is unclear (Variance: {blur_variance:.2f}) — please capture a sharper photo."

        # 2. BRIGHTNESS CHECK (Under & Over Exposure)
        avg_intensity = float(np.mean(gray))
        if avg_intensity < 40:
            return False, "Image is too dark. Please photograph the crop in better lighting."
        if avg_intensity > 230:
            return False, "Image is overexposed (too bright). Please reduce glare."

        return True, "Quality Verified"

    except Exception as e:
        return False, f"Preprocessing Error: {e}"


def extract_live_gps(image_bytes: bytes) -> tuple[float, float]:
    """
    Stage 01: Drone/Mobile Capture Metadata Extraction.
    Extracts GPS from EXIF or falls back to Mangalore (Demo Region).
    """
    try:
        # Using simple Pillow for EXIF to avoid heavy dependencies
        from PIL import Image
        from PIL.ExifTags import TAGS, GPSTAGS

        img = Image.open(io.BytesIO(image_bytes))
        exif = img._getexif()
        
        if exif:
            gps_info = {}
            for key, value in exif.items():
                decoded = TAGS.get(key, key)
                if decoded == "GPSInfo":
                    for t in value:
                        sub_decoded = GPSTAGS.get(t, t)
                        gps_info[sub_decoded] = value[t]

            if "GPSLatitude" in gps_info:
                def convert_to_degrees(value):
                    d, m, s = value
                    return d + (m / 60.0) + (s / 3600.0)

                lat = convert_to_degrees(gps_info["GPSLatitude"])
                lon = convert_to_degrees(gps_info["GPSLongitude"])
                return lat, lon
    except Exception:
        pass 

    # FALLBACK: Mangalore, Karnataka (Required for Drone Simulation)
    return 12.9141, 74.8560