// scripts.js
document.getElementById('uploadButton').addEventListener('click', function() {
    document.getElementById('upload').click();
});

document.getElementById('upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById('uploadedImage');
            img.src = e.target.result;
            img.style.display = 'block';
            document.getElementById('colorPickerContainer').style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});

document.getElementById('removeColorButton').addEventListener('click', function() {
    const img = document.getElementById('uploadedImage');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    
    const imgObj = new Image();
    imgObj.src = img.src;
    imgObj.onload = function() {
        canvas.width = imgObj.width;
        canvas.height = imgObj.height;
        context.drawImage(imgObj, 0, 0);

        const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        
        const [r, g, b] = hexToRgb(colorPicker.value);

        for (let i = 0; i < data.length; i += 4) {
            if (data[i] === r && data[i + 1] === g && data[i + 2] === b) {
                data[i + 3] = 0; // Set alpha to 0 (transparent)
            }
        }

        context.putImageData(imgData, 0, 0);
        document.getElementById('downloadLink').href = canvas.toDataURL();
        document.getElementById('downloadLink').download = 'ImagemSemFundo.RemoverDeFundosJL.png';
        document.getElementById('downloadLink').style.display = 'block';
        document.getElementById('downloadLink').innerText = 'Baixar imagem';
    }
});

document.getElementById('colorPickerButton').addEventListener('click', function() {
    const img = document.getElementById('uploadedImage');
    img.style.cursor = 'crosshair';
    
    img.addEventListener('click', pickColor);
});

function pickColor(event) {
    const img = document.getElementById('uploadedImage');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0, img.width, img.height);
    
    const rect = img.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const imgData = context.getImageData(x, y, 1, 1).data;
    const hexColor = rgbToHex(imgData[0], imgData[1], imgData[2]);
    
    document.getElementById('colorPicker').value = hexColor;
    img.style.cursor = 'default';
    img.removeEventListener('click', pickColor);
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}
