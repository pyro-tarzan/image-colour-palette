from PIL import Image
from collections import Counter
from flask import Flask, request, jsonify
from flask_cors import CORS
import math
    
def calculate_color_distance(color1, color2):
    return math.sqrt(sum((c1 - c2) ** 2 for c1, c2 in zip(color1, color2)))

def filter_unique_colors(colors, max_color=10, minimum_distance=50):
    unique_colors = []
    for color in colors:
        if len(unique_colors) >= max_color:
            break

        if all(calculate_color_distance(color, existing_color) > minimum_distance for existing_color, _ in unique_colors):
            unique_colors.append((color, 1))
    return unique_colors

def generate_colors_from_pictures(image):
    image = image.resize((100, 100))

    pixels = list(image.getdata())
    common_colors = Counter(pixels).most_common()
    unique = filter_unique_colors([color for color, _ in common_colors])
    return [("#{:02x}{:02x}{:02x}".format(*color), freq) for color, freq in unique]
    
app = Flask(__name__)

CORS(app=app, origins="http://localhost:3000")

@app.route("/get-hex-colors", methods=["GET", "POST"])
def get_hex_colors():
    if request.method == "POST":
        file = request.files["file"]
        if file .filename == "":
            return jsonify({"message": "No selected file."}), 200
        
        try:
            image = Image.open(file)
        except Exception as e:
            return jsonify({"message": "Can't perform processing."}), 200
        
        colors = generate_colors_from_pictures(image=image)
        return jsonify({"colors": colors}), 200
    else:
        return jsonify({"message": "working."})

if __name__ == "__main__":
    app.run(debug=True)