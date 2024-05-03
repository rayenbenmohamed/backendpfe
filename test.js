const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

// Define the URL of your API endpoint
const url = 'http://localhost:3001/api/formations';

// Read the image file as a buffer
const imagePath = 'C:/Users/USER/Desktop/stick.png';
const imageBuffer = fs.readFileSync(imagePath);

// Define the formation data
const formationData = {
    nomformation: 'Your Formation Name',
    duree: 'Your Formation Duration',
    description: 'Your Formation Description',
    prix: 100, // Example price
    niveau: 'Beginner',
    categorie: 'Your Category ID' // Assuming you have the category ID
};

// Create a FormData object to send the data and image
const formData = new FormData();
for (const key in formationData) {
    formData.append(key, formationData[key]);
}
formData.append('image', imageBuffer, {
    filename: 'stick.png', // Specify the filename for the image
    contentType: 'image/png' // Specify the content type of the image
});

// Send a POST request to the endpoint
axios.post(url, formData, {
    headers: {
        ...formData.getHeaders() // Set headers manually
    }
})
.then(response => {
    console.log('Response:', response.data);
})
.catch(error => {
    if (error.response) {
        console.error('Error:', error.response.data);
    } else {
        console.error('Error:', error.message);
    }
});

