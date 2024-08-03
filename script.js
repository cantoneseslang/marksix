body {
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background-color: #f4f4f4;
}

.container {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 600px;
    text-align: center;
}

h1, h2 {
    font-size: 24px;
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 10px;
}

input[type="date"] {
    padding: 10px;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 20px;
}

button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

ul {
    list-style: none;
    padding: 0;
}

ul li {
    background: #e9ecef;
    margin: 5px 0;
    padding: 10px;
    border-radius: 5px;
}

#frequencies-list {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
}

.frequency-column {
    display: flex;
    flex-direction: column;
}

.frequency-column li {
    flex: 1;
}
