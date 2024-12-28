from flask import Flask, render_template, request, jsonify
import numpy as np

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    try:
        data = request.json
        operation = data['operation']
        matrix_a = np.array(data['matrix_a'])
        matrix_b = np.array(data.get('matrix_b', [])) if 'matrix_b' in data else None

        result = None

        if operation == 'add':
            result = matrix_a + matrix_b
        elif operation == 'subtract':
            result = matrix_a - matrix_b
        elif operation == 'multiply':
            result = np.dot(matrix_a, matrix_b)
        elif operation == 'transpose':
            result = matrix_a.T
        elif operation == 'determinant':
            result = np.linalg.det(matrix_a)
        elif operation == 'inverse':
            result = np.linalg.inv(matrix_a)

        return jsonify({'result': result.tolist() if isinstance(result, np.ndarray) else result})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
