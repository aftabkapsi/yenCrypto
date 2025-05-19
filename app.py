from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

def encrypt(text, shift):
    result = ""
    # Go through each character
    for char in text:
        # Check if character is a letter
        if char.isalpha():
            # Get ASCII code
            ascii_offset = ord('a') if char.islower() else ord('A')
            # Apply the shift
            encrypted = chr((ord(char) - ascii_offset + shift) % 26 + ascii_offset)
            result += encrypted
        else:
            # Keep non-alphabetic characters as they are
            result += char
    return result

def decrypt(text, shift):
    # Decryption is just encryption with the negative shift
    return encrypt(text, -shift)

@app.route('/') #route to the main page
def index():
    return render_template('index.html')

@app.route('/process', methods=['POST'])
def process():
    data = request.get_json()
    text = data.get('text', '')
    shift = data.get('shift', 3)
    mode = data.get('mode', 'encrypt')
    
    if mode == 'encrypt':
        result = encrypt(text, shift)
    else:
        result = decrypt(text, shift)
        
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True)