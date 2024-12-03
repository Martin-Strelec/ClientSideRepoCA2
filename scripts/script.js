//HTML elements
const inputsContainer = document.getElementById('inputs');
const pageHeader = document.getElementById('heading');
const pageNavigation = document.getElementById('navigation');

//Global variables & settings
const itemsOnPage = 80;
var pageIndexPrevious = 0;
var pageIndexNext = + itemsOnPage;
var hotspotsList;

fetchHotspotList(`https://entities.nft.helium.io/v2/hotspots?subnetwork=iot&cursor=`);

createCountryCheckBox(inputs);
createStatusChechBox(inputs);
createHeading(heading);

//Action Functions
//Seacrching for hotspot by its Asset key
function searchByAssetKey(key) {
    if (!key == "") {
        hotspotsDiv = document.getElementById('hotspots');
        hotspotsDiv.innerHTML = '';
        navDiv = document.getElementById('navigation');
        navDiv.style.visibility = 'hidden';
        fetchHotspotData(key);
    }
}
//Turning page
function turnPage(pageIndex) {
    hotspotsDiv = document.getElementById('hotspots');
    hotspotsDiv.innerHTML = '';
    fetchHotspots();
}
//Filtering Data based on values in checkboxes
function checkCountry(CountryValue, country) {
    if (country.checked) {
        if (country.value == `${CountryValue}`) {
            return true
        }
        else {
            return false;
        }
    }
}
//Filtering data based on hotspot status
function checkStatus(StatusValue) {
    var status = document.querySelector('input[name=status]:checked').value;
    var passed;
    if (status != 'All') {
        if (status == `${StatusValue}`) {
            return true
        }
        else {
            return false;
        }
    }
    else {
        return true;
    }
}
//Fetching list of hotspot's asset keys
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
        createTextInputs(inputs);
        createFetchButton(inputs);
        fetchHotspots();
    } catch (error) {
        document.getElementById('error').textContent = `Could not fetch hotspot-list: ${error.message}`;
    }
}
//Fetching all the hotspots 
async function fetchHotspots() {
    for (var i = pageIndexPrevious; i <= pageIndexNext; i++) {
        fetchHotspotData(hotspotsList.items[i].key_to_asset_key);
    }
    pageNavigation.innerHTML = "";
    createPageNavigation(pageIndexPrevious, pageNavigation);
}
//Fetching data from each hotspot
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
        filterData(hotspotData);
    } catch (error) {
        document.getElementById('error').textContent = `Could not fetch hotspot-info: ${error.message}`;
    }
}
//Filtering data based on the country and the hotspot status
function filterData(hotspotData) {
    if (checkStatus(hotspotData.hotspot_infos.iot.is_active)) {
        const countries = document.querySelectorAll('input[id^=country-checkbox-]:checked');
        if (countries.length != 0) {
            countries.forEach(country => {
                if (checkCountry(hotspotData.hotspot_infos.iot.country, country)) {
                    renderHotspotData(hotspotData, document.getElementById('hotspots'));
                }
            })
        }
        else {
            renderHotspotData(hotspotData, document.getElementById('hotspots'));
        }
    }
}

//Creation functions
//Create Status radials
function createStatusChechBox(container) {
    //Create checkboxes for state of the Hotspot
    const radiosContainer = document.createElement('div');
    radiosContainer.classList.add('inputContainers');

    const header = document.createElement('h3');
    header.textContent = "Status: ";
    radiosContainer.appendChild(header);

    const statuses = [
        { value: 'All', label: 'All', checked: true },
        { value: true, label: 'Active', checked: false },
        { value: false, label: 'Not Active', checked: false }
    ];

    statuses.forEach(status => {
        const radioContainer = document.createElement('div');
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.id = `status-radio-${status.value}`;
        radio.value = status.value;
        radio.name = 'status';
        if (status.checked) {
            radio.setAttribute('checked', true);
        }
        const label = document.createElement('label');
        label.textContent = status.label;
        label.setAttribute("for", `status-radio-${status.value}`);

        radioContainer.appendChild(label);
        radioContainer.appendChild(radio);
        radiosContainer.appendChild(radioContainer);
    })
    container.appendChild(radiosContainer);
}
//Create checkboxes
function createCountryCheckBox(container) {
    const countries = ['Ireland', 'United States', 'Canada', 'Česko', 'Slovensko', 'United Kingdom'];

    // Create the checkbox
    const checkboxesContainer = document.createElement('div');
    checkboxesContainer.classList.add('inputContainers');
    const header = document.createElement('h3');

    header.textContent = "Countries: ";
    checkboxesContainer.appendChild(header);

    countries.forEach(country => {
        const checkboxContainer = document.createElement('div');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `country-checkbox-${country}`;
        checkbox.value = `${country}`;
        checkbox.name = 'countries';
        const label = document.createElement('label');
        label.textContent = `${country}`;
        label.setAttribute("for", `country-checkbox-${country}`);

        checkboxContainer.appendChild(label);
        checkboxContainer.appendChild(checkbox);
        checkboxesContainer.appendChild(checkboxContainer);
        container.appendChild(checkboxesContainer);
    })
}
//Create heading 
function createHeading(container) {
    const heading = document.createElement('h1');
    heading.textContent = "Hotspot Viewer"
    container.appendChild(heading);
}
//Create text inputs 
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
    //assetKeyBtn.classList.add('buttonStyle');
    assetKeyBtn.addEventListener('click', () => { searchByAssetKey(assetKeyTextInput.value) });

    buttonContainer.appendChild(assetKeyTextInput);
    buttonContainer.appendChild(assetKeyBtn);
    textInputContainer.appendChild(header);
    textInputContainer.appendChild(buttonContainer);
    container.appendChild(textInputContainer);
}
//Create button for fetching hotspots based filters
function createFetchButton(container) {
    const buttonContainer = document.createElement('div');

    const fetchBtn = document.createElement('input');
    fetchBtn.type = 'button';
    fetchBtn.id = 'fetchBtn';
    fetchBtn.value = 'Find Hotspots';
    fetchBtn.classList.add('buttonStyle');
    fetchBtn.addEventListener('click', () => {
        document.getElementById('hotspots').innerHTML = "";
        navDiv = document.getElementById('navigation');
        navDiv.style.visibility = 'visible';
        fetchHotspots()
    })


    buttonContainer.appendChild(fetchBtn);
    container.appendChild(buttonContainer);
}
//Create page navigation at the bottom of the page
function createPageNavigation(pageIndex, container) {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('inputContainers');

    const assetKeyTextInput = document.createElement('input');
    assetKeyTextInput.type = 'text';
    assetKeyTextInput.id = `assetKeyTextInput`;

    const homePage = document.createElement('input');
    homePage.type = 'button';
    homePage.id = 'homePageBtn';
    homePage.value = 'Home Page';
    homePage.classList.add('buttonStyle');
    homePage.addEventListener('click', () => {
        pageIndexPrevious = 0;
        turnPage();
    });
    buttonsContainer.appendChild(homePage);

    if (pageIndex > 0) {

        const previousPage = document.createElement('input');
        previousPage.type = 'button';
        previousPage.id = 'previousPageBtn';
        previousPage.value = 'Previous Page';
        previousPage.classList.add('buttonStyle');
        previousPage.addEventListener('click', () => {

            pageIndexNext = pageIndexPrevious;
            pageIndexPrevious -= itemsOnPage;
            turnPage();
        });
        buttonsContainer.appendChild(previousPage);
    }

    if ((pageIndex + itemsOnPage) < hotspotsList.items.length) {
        const nextPage = document.createElement('input');
        nextPage.type = 'button';
        nextPage.id = 'nextPageBtn';
        nextPage.value = 'NextPage';
        nextPage.classList.add('buttonStyle');
        nextPage.addEventListener('click', () => {
            pageIndexPrevious = pageIndexNext;
            pageIndexNext += itemsOnPage;
            turnPage();
        });
        buttonsContainer.appendChild(nextPage);
    }

    container.appendChild(buttonsContainer);
}
// Render posts inside the user's posts container
function renderHotspotData(hotspotData, container) {

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
