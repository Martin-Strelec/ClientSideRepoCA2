// API URL and options
createCityCheckBox(document.getElementById('inputs'));
createStatusChechBox(document.getElementById('inputs'));
createHeading(document.createElement('h1'));

fetchHotspotList(`https://entities.nft.helium.io/v2/hotspots?subnetwork=iot&cursor=`);

function searchByAssetKey() {
    hotspotsDiv = document.getElementById('hotspots');
    hotspotsDiv.innerHTML = '';
    fetchHotspotData(key);
}

function turnPage() {
    hotspotsDiv = document.getElementById('hotspots');
    hotspotsDiv.innerHTML = '';
    fetchHotspots();
}

async function fetchHotspotList(url) {
    const options = {
        method: 'GET'
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const hotspotList = await response.json();
        fetchHotspots(hotspotList);
    } catch (error) {
        document.getElementById('heading').textContent = `Could not fetch hotspot-list: ${error.message}`;
    }
}

async function fetchHotspots(hotspotList) {
    var startingPoint = 0;
    const itemsOnPage = 50;

    for (var i = startingPoint; i < startingPoint + itemsOnPage; i++) {
        fetchHotspotData(hotspotList.items[i].key_to_asset_key);
    }
    startingPoint += itemsOnPage;
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
        renderHotspotData(hotspotData, document.getElementById('hotspots'), null);
    } catch (error) {
        document.getElementById('heading').textContent = `Could not fetch hotspot-info: ${error.message}`;
    }
}

function createStatusChechBox(container) {
    //Create checkboxes for state of the Hotspot
    const checkboxesContainer = document.createElement('div');
    checkboxesContainer.classList.add('inputContainers');

    const header = document.createElement('h3');

    header.textContent = "Status: ";
    checkboxesContainer.appendChild(header);

    const statuses = [true, false];
    statuses.forEach(status => {
        const checkboxContainer = document.createElement('div');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `city-checkbox-${status ? "active" : "notActive"}`;
        checkbox.value = `${status}`;
        const label = document.createElement('label');
        label.textContent = `${status ? "Active" : "Not Active"}`;
        label.setAttribute("for", `city-checkbox-${status}`);



        checkboxContainer.appendChild(label);
        checkboxContainer.appendChild(checkbox);
        checkboxesContainer.appendChild(checkboxContainer);
    })

    container.appendChild(checkboxesContainer);
}

function createCountryCheckBox(container) {

    // Create the checkbox
    const checkboxesContainer = document.createElement('div');
    checkboxesContainer.classList.add('inputContainers');
    const header = document.createElement('h3');

    header.textContent = "Countries: ";
    checkboxesContainer.appendChild(header);

    const countries = ["Ireland", "United States", "United Kingdom", "Canada", "Česko", "Slovensko"];
    countries.forEach(country => {
        const checkboxContainer = document.createElement('div');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `city-checkbox-${country}`;
        checkbox.value = `${country}`;
        const label = document.createElement('label');
        label.textContent = `${country}`;
        label.setAttribute("for", `city-checkbox-${country}`);

        checkboxContainer.appendChild(label);
        checkboxContainer.appendChild(checkbox);
        checkboxesContainer.appendChild(checkboxContainer);
        container.appendChild(checkboxesContainer);
    })
}

function createHeading (container) {
    const heading = document.createElement('h1');
    heading.textContent = "Hotspot Viewer"
    container.appendChild(heading);
}

function createTextInputs(container) {

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add("buttonContainer");

    // const assetKey = document.createElement('input');
    // humidityInput.type = 'text';
    // humidityInput.id = `hotspostLocationInput`;
    // humidityInput.textContent = 'Custom location: '
    // buttonContainer.appendChild(humidityInput);

    // const fetchButton = document.createElement('button');
    // fetchButton.textContent = 'Fetch Hotspots';
    // fetchButton.addEventListener('click', buttonFetch);
    // buttonContainer.appendChild(fetchButton);

    // container.appendChild(buttonContainer);
}

// Render posts inside the user's posts container
function renderHotspotData(hotspotData, container, country) {

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
