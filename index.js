document.addEventListener('DOMContentLoaded', function() {
    // Check which HTML file is currently loaded
    if (document.title === "Countries") {
        // Code specific to "Countries" page
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');
        const searchResults = document.getElementById('searchResults');

        searchButton.addEventListener('click', function() {
            const name = searchInput.value;
            // Perform fetch request
            fetch(`https://restcountries.com/v3.1/name/${name}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // Display search results
                    displaySearchResults(data);
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                    searchResults.innerHTML = 'An error occurred while fetching data.';
                });
        });

        function displaySearchResults(data) {
            // Clear previous search results
            searchResults.innerHTML = '';

            // Display each result
            data.forEach(country => {
                const resultItem = document.createElement('div');
                resultItem.classList.add('result-item');
                resultItem.innerHTML = `
                    <div class="rounded p-4 shadow-md bg-white m-10">
                       <img src="${country.flags.png}" class="w-full" alt="">
                       <h3 class="text-xl font-bold">${country.name.common}</h3>
                       <h5 class="text-sm">Independent: ${country.independent ? 'Independent' : 'Dependent'}</h5>
                       <h5 class="text-sm">Capital: ${country.capital}</h5>
                       <h5 class="text-sm">Region: ${country.region}</h5>
                       <button class="btn bg-red-900 text-white hover:text-red-900 my-5 see-more-btn">See More</button>
                   </div>
                `;

                resultItem.querySelector('.see-more-btn').addEventListener('click', function() {
                    // Redirect to "Country Details" page with country name
                    window.location.href = `country-details.html?name=${encodeURIComponent(country.name.common)}`;
                });

                searchResults.appendChild(resultItem);
            });

            if (data.length === 0) {
                searchResults.innerHTML = 'No results found.';
            }
        }
    } else if (document.title === "Country Details") {
        // Code specific to "Country Details" page
        const params = new URLSearchParams(window.location.search);
        const countryName = params.get('name');

        // Fetch additional details for the country
        fetch(`https://restcountries.com/v3.1/name/${countryName}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Extract details from the response
                const countryDetails = data[0]; // Assuming the first result is the correct country
                // Create a div element to show country details
                const countryDetailsDiv = document.createElement('div');
                countryDetailsDiv.classList.add('country-details');
                countryDetailsDiv.innerHTML = `
                    <h2 class="text-4xl font-bold p-2">${countryDetails.name.official}</h2>
                    <p class="text-xl p-1"><b>Capital:</b> ${countryDetails.capital}</p>
                    <p class="text-xl p-1"><b>Population:</b> ${countryDetails.population}</p>
                    <p class="text-xl p-1"><b>Status:</b> ${countryDetails.status}</p>
                    <p class="text-xl p-1"><b>Independent:</b> ${countryDetails.independent}</p>
                    <p class="text-xl p-1"><b>Region:</b> ${countryDetails.region}</p>
                    <p class="text-xl p-1"><b>Area:</b> ${countryDetails.area} sq.km.</p>
                    <p class="text-xl p-1"><b>Continents:</b> ${countryDetails.continents}</p>
                    <img src="${countryDetails.flags.png}" class="w-full p-4" alt="">
                `;

                // Clear previous country details if any
                const countryDetailsContainer = document.getElementById('countryDetails');
                countryDetailsContainer.innerHTML = '';

                // Append the country details div to the container
                countryDetailsContainer.appendChild(countryDetailsDiv);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                // Display an error message if fetching additional details fails
                const countryDetailsContainer = document.getElementById('countryDetails');
                countryDetailsContainer.innerHTML = 'Failed to fetch additional details for the country.';
            });
    }
});
