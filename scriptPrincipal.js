document.addEventListener("DOMContentLoaded", () => {
  const hats = [];
  const torsos = [];
  const pants = [];
  const shoes = [];

  let counter = 0; // contador outfits

  function setupInput(inputId, array, listId) {
    const input = document.getElementById(inputId);
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        array.push(event.target.result);
        const img = document.createElement('img');
        img.src = event.target.result;
        document.getElementById(listId).appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  }

  setupInput('hatInput', hats, 'hatList');
  setupInput('torsoInput', torsos, 'torsoList');
  setupInput('pantsInput', pants, 'pantsList');
  setupInput('shoesInput', shoes, 'shoesList');

  // Botones de "Cargar"
  document.querySelectorAll('.upload-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      document.getElementById(targetId).click();
    });
  });

  const outfitDiv = document.getElementById('outfitPreview');
  const counterDisplay = document.getElementById('counter');
  const savedOutfitsDiv = document.getElementById('savedOutfits');

  // Generar outfit
  document.getElementById('generateBtn').addEventListener('click', () => {
    outfitDiv.innerHTML = '';

    if (torsos.length === 0 || pants.length === 0 || shoes.length === 0) {
      alert("Debes cargar torso, piernas y zapatillas.");
      return;
    }

    // Sombrero opcional
    if (hats.length > 0 && Math.random() > 0.5) {
      const hatImg = document.createElement('img');
      hatImg.src = hats[Math.floor(Math.random() * hats.length)];
      hatImg.classList.add('hat');
      outfitDiv.appendChild(hatImg);
    }

    const torsoImg = document.createElement('img');
    torsoImg.src = torsos[Math.floor(Math.random() * torsos.length)];
    torsoImg.classList.add('torso');
    outfitDiv.appendChild(torsoImg);

    const pantsImg = document.createElement('img');
    pantsImg.src = pants[Math.floor(Math.random() * pants.length)];
    pantsImg.classList.add('pants');
    outfitDiv.appendChild(pantsImg);

    const shoesImg = document.createElement('img');
    shoesImg.src = shoes[Math.floor(Math.random() * shoes.length)];
    shoesImg.classList.add('shoes');
    outfitDiv.appendChild(shoesImg);

    // contador
    counter++;
    counterDisplay.textContent = `Outfits generados: ${counter}`;
  });

  // Guardar outfit en historial
  // Guardar outfit en historial
document.getElementById('saveBtn').addEventListener('click', () => {
  if (outfitDiv.innerHTML.trim() === "") {
    alert("Primero genera un outfit.");
    return;
  }

  const clone = outfitDiv.cloneNode(true);
  clone.classList.remove("outfit-preview"); 
  clone.classList.add("saved-outfit"); // ✅ usar clase para estilo

  savedOutfitsDiv.appendChild(clone);
});


  // Descargar outfit como imagen
  document.getElementById('downloadBtn').addEventListener('click', () => {
    if (outfitDiv.innerHTML.trim() === "") {
      alert("Primero genera un outfit.");
      return;
    }


    
    // Usamos html2canvas para exportar
    html2canvas(outfitDiv).then(canvas => {
      const link = document.createElement("a");
      link.download = "outfit.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  });
});

