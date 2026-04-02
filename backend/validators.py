import cv2
import numpy as np
import io
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS

def check_image_quality(image_bytes: bytes) -> tuple[bool, str]:
    """Validates crop image quality based on blur and exposure."""
    try:
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None:
            return False, "Invalid image format. Please upload JPEG/PNG."

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Blur check (Threshold 30 as discussed)
        blur_variance = cv2.Laplacian(gray, cv2.CV_64F).var()
        if blur_variance < 30:
            return False, f"Image is unclear (Variance: {blur_variance:.2f}) — please capture a sharper photo."

        # Brightness check
        avg_intensity = float(np.mean(gray))
        if avg_intensity < 5:
            return False, "Image is too dark."
        if avg_intensity > 230:
            return False, "Image is overexposed."

        return True, "Quality Verified"
    except Exception as e:
        return False, f"Preprocessing Error: {e}"

def extract_live_gps(image_bytes: bytes) -> tuple[float, float]:
    """Extracts GPS from EXIF or falls back to Mangalore."""
    try:
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
                    return float(d) + (float(m) / 60.0) + (float(s) / 3600.0)
                lat = convert_to_degrees(gps_info["GPSLatitude"])
                lon = convert_to_degrees(gps_info["GPSLongitude"])
                return lat, lon
    except Exception:
        pass 
    return 12.9141, 74.8560