// API URL and options
const inputsContainer = document.getElementById('inputs');
const pageHeader = document.getElementById('heading');
const pageNavigation = document.getElementById('navigation');

const itemsOnPage = 80;
var pageIndexPrevious = 0;
var pageIndexNext =+ itemsOnPage; 
var hotspotsList;

fetchHotspotList(`https://entities.nft.helium.io/v2/hotspots?subnetwork=iot&cursor=`);

createCountryCheckBox(inputs);
createStatusChechBox(inputs);
createTextInputs(inputs);

createHeading(heading);

function searchByAssetKey(key) {
    if (!key == "") {
        hotspotsDiv = document.getElementById('hotspots');
        hotspotsDiv.innerHTML = '';
        fetchHotspotData(key);
    }
}

function turnPage(pageIndex) {
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
        hotspotsList = await response.json();
        fetchHotspots();
    } catch (error) {
        document.getElementById('heading').textContent = `Could not fetch hotspot-list: ${error.message}`;
    }
}

async function fetchHotspots() {
    for (var i = pageIndexPrevious; i <= pageIndexNext; i++) {
        fetchHotspotData(hotspotsList.items[i].key_to_asset_key);
    }
    pageNavigation.innerHTML = "";
    createPageNavigation(pageIndexPrevious, pageNavigation);
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

function createHeading(container) {
    const heading = document.createElement('h1');
    heading.textContent = "Hotspot Viewer"
    container.appendChild(heading);
}

function createTextInputs(container) {
    const textInputContainer = document.createElement('div');
    textInputContainer.classList.add('inputContainers');
    const buttonContainer = document.createElement('div');

    const header = document.createElement('h3');
    header.textContent = `Search by Asset Key: `;

    const assetKeyTextInput = document.createElement('input');
    assetKeyTextInput.type = 'text';
    assetKeyTextInput.id = `assetKeyTextInput`;

    const assetKeyBtn = document.createElement('input');
    assetKeyBtn.type = 'button';
    assetKeyBtn.id = 'assetKeyBtn';
    assetKeyBtn.value = 'Search';
    assetKeyBtn.addEventListener('click', searchByAssetKey(assetKeyTextInput.value));

    buttonContainer.appendChild(assetKeyTextInput);
    buttonContainer.appendChild(assetKeyBtn);
    textInputContainer.appendChild(header);
    textInputContainer.appendChild(buttonContainer);
    container.appendChild(textInputContainer);
}

function createPageNavigation(pageIndex, container) {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('inputContainers');

    const assetKeyTextInput = document.createElement('input');
    assetKeyTextInput.type = 'text';
    assetKeyTextInput.id = `assetKeyTextInput`;

    if (pageIndex > 0) {

        const previousPage = document.createElement('input');
        previousPage.type = 'button';
        previousPage.id = 'assetKeyBtn';
        previousPage.value = 'Previous Page';
        previousPage.addEventListener('click',() => {
            
            pageIndexNext = pageIndexPrevious;
            pageIndexPrevious -= itemsOnPage;
            turnPage();
        });
        buttonsContainer.appendChild(previousPage);
    }

    if ((pageIndex + itemsOnPage) < hotspotsList.items.length) {
        const nextPage = document.createElement('input');
        nextPage.type = 'button';
        nextPage.id = 'assetKeyBtn';
        nextPage.value = 'NextPage';
        nextPage.addEventListener('click',() => {
            pageIndexPrevious = pageIndexNext;
            pageIndexNext += itemsOnPage;
            turnPage();
        });
        buttonsContainer.appendChild(nextPage);
    }

    container.appendChild(buttonsContainer);
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
