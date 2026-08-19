# airport-info-finder-team-skyquery
Team Project: Airport Info Finder - Team SkyQuery
Airport Info Finder
A browser-based airport lookup tool built with the AviationStack API. Search any airport by name, IATA code, or country, view its key details on a result card, drop a pin on a live map, compare two airports side by side, and bookmark the ones you care about.
Features
Search by airport name, IATA code, or country, with a typeahead dropdown suggesting matching IATA codes and airport names as you type (built-in index of ~85 major world airports, including major Nigerian airports)
Result card showing airport name, IATA/ICAO codes, city, country, timezone, GMT offset, coordinates, and active airlines
Map view — an interactive Leaflet map pinned to the airport's coordinates
Compare — look up two airports side by side, including a dual map view
Saved airports — bookmark airports for quick access later, persisted via browser localStorage
Session stats — a live line showing how many searches were run this session, success rate, and average response time
Local caching & request throttling — repeat lookups are cached for 5 minutes, and outgoing requests are spaced at least 900ms apart, to avoid hitting AviationStack's free-tier rate limit
Error handling — clear inline messages for missing API keys, invalid/unknown codes, and failed requests
Tech stack
HTML, CSS, vanilla JavaScript — no build step or framework
Leaflet.js for maps, with CARTO dark-theme tiles
AviationStack API for airport and flight data
Google Fonts: Fraunces (display), Inter (body), Space Mono (labels/data)
Browser localStorage for saved airports — no backend, no accounts
Getting started
Get a free API key at aviationstack.com
Open airport-info-finder.html in your browser
Paste your API key into the AviationStack API key field
Search for an airport, or try one of the popular codes (LHR, JFK, HND, SIN)
Your API key is only kept in the browser tab for the session — it isn't saved or sent anywhere except directly to AviationStack.
Project structure
This is a single self-contained file:
airport-info-finder.html   → all HTML, CSS, and JS in one place
API endpoints used
GET /v1/airports — airport lookup by iata_code, search (name), or country
GET /v1/flights — active flights filtered by dep_iata, used to surface which airlines currently serve an airport
Known limitations
Typeahead suggestions are drawn from a built-in offline list rather than a live API call (AviationStack's live search-as-you-type autocomplete requires a paid plan) — searching a smaller regional airport directly by its exact code still works fine
Free-tier AviationStack keys are HTTP-only; some browsers may show mixed-content warnings if the page itself is served over HTTPS
Roadmap / possible improvements
Expand the offline airport index for broader typeahead coverage
Add flight status lookup per airport
Export saved airports as a shareable list
Formal peer/user testing to validate search success rate and task completion time
License
For educational use as part of an SDLC coursework project — SWE 221, Federal University of Technology Minna.
