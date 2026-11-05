
const bookGrid = document.getElementById("bookGrid");

const searchInput = document.getElementById("searchInput");
const ratingFilter = document.getElementById("ratingFilter");
const availabilityFilter = document.getElementById("availabilityFilter");
const sortFilter = document.getElementById("sortFilter");

let books = [];

// Load JSON data
async function loadBooks() {

    try {

        const response = await fetch("./books.json");

        if (!response.ok) {
            throw new Error("Unable to load books.json");
        }

        books = await response.json();

        updateStatistics();

        displayBooks(books);

    } catch (error) {

        console.error("Error:", error);

        bookGrid.innerHTML = `
            <div class="empty-state">
                <h3>Unable to load books</h3>
                <p>Check whether books.json exists and run the project using a local server.</p>
            </div>
        `;
    }
}


// Update Dashboard Statistics
function updateStatistics() {

    const total = books.length;

    const available = books.filter(book =>
        book.availability.toLowerCase().includes("in stock")
    ).length;

    const fiveStar = books.filter(book =>
        book.rating.toLowerCase() === "five"
    ).length;

    const totalPrice = books.reduce((sum, book) => {

        return sum + parseFloat(
            book.price.replace(/[^\d.]/g, "")
        );

    }, 0);

    const average = total > 0 ? totalPrice / total : 0;

    document.getElementById("totalBooks").textContent = total;

    document.getElementById("inStock").textContent = available;

    document.getElementById("fiveStar").textContent = fiveStar;

    document.getElementById("averagePrice").textContent =
        "£" + average.toFixed(2);
}


// Display Book Cards
function displayBooks(data) {

    bookGrid.innerHTML = "";

    document.getElementById("resultCount").textContent =
        `${data.length} books found`;

    if (data.length === 0) {

        bookGrid.innerHTML = `
            <div class="empty-state">
                <h3>No books found</h3>
                <p>Try changing your search or filters.</p>
            </div>
        `;

        return;
    }

    data.forEach(book => {

        const rating = book.rating.toLowerCase();

        const stars = {
            five: 5,
            four: 4,
            three: 3,
            two: 2,
            one: 1
        }[rating] || 0;

        const isAvailable =
            book.availability.toLowerCase().includes("in stock");

        const card = document.createElement("div");

        card.className = "book-card";

        // Create elements safely from scraped text
        const imageBox = document.createElement("div");
        imageBox.className = "book-image";

        const image = document.createElement("img");
        image.src = book.image;
        image.alt = book.title;
        image.loading = "lazy";

        image.onerror = function () {
            this.style.display = "none";
            imageBox.textContent = "📚";
        };

        imageBox.appendChild(image);

        const info = document.createElement("div");
        info.className = "book-info";

        const title = document.createElement("h3");
        title.className = "book-title";
        title.textContent = book.title;
        title.title = book.title;

        const ratingElement = document.createElement("div");
        ratingElement.className = "book-rating";
        ratingElement.textContent =
            "★".repeat(stars) + "☆".repeat(5 - stars);

        const bottom = document.createElement("div");
        bottom.className = "book-bottom";

        const price = document.createElement("span");
        price.className = "book-price";
        price.textContent = book.price;

        const availability = document.createElement("span");
        availability.className = "availability";

        if (!isAvailable) {
            availability.classList.add("out");
        }

        availability.textContent = book.availability;

        bottom.appendChild(price);
        bottom.appendChild(availability);

        info.appendChild(title);
        info.appendChild(ratingElement);
        info.appendChild(bottom);

        card.appendChild(imageBox);
        card.appendChild(info);

        bookGrid.appendChild(card);

    });

}


// Search, Filter and Sort
function filterBooks() {

    let filtered = [...books];

    // Search by title
    const searchValue = searchInput.value.toLowerCase().trim();

    if (searchValue) {

        filtered = filtered.filter(book =>
            book.title.toLowerCase().includes(searchValue)
        );

    }

    // Filter by rating
    const selectedRating = ratingFilter.value;

    if (selectedRating !== "all") {

        filtered = filtered.filter(book =>
            book.rating.toLowerCase() === selectedRating.toLowerCase()
        );

    }

    // Filter by availability
    const selectedAvailability = availabilityFilter.value;

    if (selectedAvailability === "in") {

        filtered = filtered.filter(book =>
            book.availability.toLowerCase().includes("in stock")
        );

    } else if (selectedAvailability === "out") {

        filtered = filtered.filter(book =>
            !book.availability.toLowerCase().includes("in stock")
        );

    }

    // Sorting
    const selectedSort = sortFilter.value;

    if (selectedSort === "low") {

        filtered.sort((a, b) =>
            parseFloat(a.price.replace(/[^\d.]/g, "")) -
            parseFloat(b.price.replace(/[^\d.]/g, ""))
        );

    } else if (selectedSort === "high") {

        filtered.sort((a, b) =>
            parseFloat(b.price.replace(/[^\d.]/g, "")) -
            parseFloat(a.price.replace(/[^\d.]/g, ""))
        );

    } else if (selectedSort === "az") {

        filtered.sort((a, b) =>
            a.title.localeCompare(b.title)
        );

    } else if (selectedSort === "za") {

        filtered.sort((a, b) =>
            b.title.localeCompare(a.title)
        );

    }

    displayBooks(filtered);

}


// Event Listeners
searchInput.addEventListener("input", filterBooks);

ratingFilter.addEventListener("change", filterBooks);

availabilityFilter.addEventListener("change", filterBooks);

sortFilter.addEventListener("change", filterBooks);


// Start Dashboard
loadBooks();
