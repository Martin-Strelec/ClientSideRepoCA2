// API URL and options
createElements(document.getElementById('inputs'));
//fetchHotspotList(`https://entities.nft.helium.io/v2/hotspots?subnetwork=iot&cursor=`);

function buttonFetch() {
    hotspotsDiv = document.getElementById('hotspots');
    hotspotsDiv.innerHTML = '';
    fetchHotspotList(`https://entities.nft.helium.io/v2/hotspots?subnetwork=iot&cursor=`)
}

async function fetchHotspotList(url, numberOfHotspots) {
    const hotspotContainer = document.getElementById("hotspots");
    const options = {
        method: 'GET'
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const hotspotList = await response.json();
        
        const selectedRadio = document.querySelectorAll("input[type='radio']:checked");
        if (selectedRadio.length == 0) {
            hotspotList.items.forEach(hotspot => {
                fetchHotspotData(hotspot.key_to_asset_key);
            })
        }
        else {
            for (var i = 0; i < selectedRadio[0].defaultValue; i++) {
                fetchHotspotData(hotspotList.items[i].key_to_asset_key);
            }
        }
        
    } catch (error) {
        document.getElementById('heading').textContent = `Could not fetch weather-info: ${error.message}`;
    }
}

// Fetch data from the API
async function fetchHotspotData(key) {
    const options = {
        method: 'GET'
    };
    try {
        const response = await fetch(`https://entities.nft.helium.io/v2/hotspot/${key}`, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const hotspotData = await response.json();

        const checkboxes = document.querySelectorAll("input[type='checkbox']")
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                renderHotspotData(hotspotData, document.getElementById('hotspots'), checkbox.value);
            }
        })
    } catch (error) {
        document.getElementById('heading').textContent = `Could not fetch hotspot-info: ${error.message}`;
    }
}



function createElements(container) {
    // Create the checkbox

    const checkboxesContainer = document.createElement('div');
    checkboxesContainer.classList.add('inputContainers');
    const cities = ["Ireland", "United States", "United Kingdom", "Canada", "Česko", "Slovensko"];
    cities.forEach(city => {
        const checkboxContainer = document.createElement('div');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `city-checkbox-${city}`;
        checkbox.value = `${city}`;
        const label = document.createElement('label');
        label.textContent = `${city}`;
        label.setAttribute("for", `city-checkbox-${city}`);

        checkboxContainer.appendChild(label);
        checkboxContainer.appendChild(checkbox);
        checkboxesContainer.appendChild(checkboxContainer);
        container.appendChild(checkboxesContainer);
    })

    const radioButtonsContainer = document.createElement('div');
    radioButtonsContainer.classList.add('inputContainers');
    const values = [50, 100, 200, 500];
    values.forEach(value => {
        const radioContainer = document.createElement('div');

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.id = `value-radio-${value}`;
        radio.value = `${value}`;
        radio.name = "numberOfHotspots";
        const label = document.createElement('label');
        label.textContent = `${value}`;
        label.setAttribute("for", `numberOfHotspots-radio-${value}`);

        radioContainer.appendChild(label);
        radioContainer.appendChild(radio);
        radioButtonsContainer.appendChild(radioContainer);
        container.appendChild(radioButtonsContainer);
    })

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add("buttonContainer");

    const humidityInput = document.createElement('input');
    humidityInput.type = 'text';
    humidityInput.id = `hotspostLocationInput`;
    humidityInput.textContent = 'Custom location: '
    buttonContainer.appendChild(humidityInput);

    const fetchButton = document.createElement('button');
    fetchButton.textContent = 'Fetch Hotspots';
    fetchButton.addEventListener('click', buttonFetch);
    buttonContainer.appendChild(fetchButton);

    container.appendChild(buttonContainer);

    const heading = document.createElement('h1');
    heading.textContent = "Hotspot Viewer"
    document.getElementById("heading").appendChild(heading);
}

// Render posts inside the user's posts container
function renderHotspotData(hotspotData, container, country) {
    if (country == hotspotData.hotspot_infos.iot.country || country == null) {

        const hotspotCard = document.createElement('div');
        hotspotCard.classList.add("hotspot-card");

        const hotspotCardDetails = document.createElement('div');
        hotspotCardDetails.classList.add("hotspot-details");

        const hotspotName = document.createElement('h3');
        hotspotName.textContent = `Name: ${hotspotData.name}`;
        hotspotName.classList.add("hotspot-details");

        const hotspotDescription = document.createElement('p');
        hotspotDescription.textContent = `Description: ${hotspotData.description}`;
        hotspotDescription.classList.add("hotspot-details");

        const hotspotImage = document.createElement('img');
        hotspotImage.setAttribute("src", `${hotspotData.image}`);
        hotspotImage.classList.add("hotspot-card");

        const hotspotHexLocationLink = document.createElement('a');
        hotspotHexLocationLink.href = `https://explorer.helium.com/hex/${hotspotData.hotspot_infos.iot.location}`;
        hotspotHexLocationLink.textContent = `${hotspotData.hotspot_infos.iot.location}`;
        const hotspotHexLocation = document.createElement('p');
        hotspotHexLocation.href = `https://explorer.helium.com/hex/${hotspotData.hotspot_infos.iot.location}`;
        hotspotHexLocation.textContent = `Location Hex: `;
        hotspotHexLocation.classList.add("hotspot-details");

        const hotspotCity = document.createElement('p');
        hotspotCity.textContent = `City: ${hotspotData.hotspot_infos.iot.city == null ? "Not stated" : hotspotData.hotspot_infos.iot.city}`;
        hotspotCity.classList.add("hotspot-details");

        const hotspotCountry = document.createElement('p');
        hotspotCountry.textContent = `Country: ${hotspotData.hotspot_infos.iot.country}`;
        hotspotCountry.classList.add("hotspot-details");

        hotspotCardDetails.appendChild(hotspotName);

        hotspotHexLocation.appendChild(hotspotHexLocationLink);
        hotspotCardDetails.appendChild(hotspotHexLocation);

        hotspotCardDetails.appendChild(hotspotCountry);
        hotspotCardDetails.appendChild(hotspotCity);
        hotspotCardDetails.appendChild(hotspotDescription);

        hotspotCard.appendChild(hotspotImage);
        hotspotCard.appendChild(hotspotCardDetails)
        container.appendChild(hotspotCard);
    }
}
