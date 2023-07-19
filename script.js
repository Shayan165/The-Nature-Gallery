var API_KEY = "38310540-53be2942fb09912591f4f4620";
var searchQuery = "nature";
var currentPage = 1;
var resultsPerPage = 20;
var totalResults = 0;
var totalPages = 0;
var imageContainer = document.getElementById("image-container");
var previousPageButton = document.getElementById("previous-page");
var nextPageButton = document.getElementById("next-page");
var pageNumberContainer = document.getElementById("page-numbers");
var totalPageContainer = document.getElementById("total-pages");

function updatePagination() {
  pageNumberContainer.innerHTML = "";

  var startPage;
  var endPage;

  if (currentPage <= 3) {
    startPage = 1;
    endPage = Math.min(3, totalPages);
  } else if (currentPage >= totalPages - 2) {
    startPage = Math.max(totalPages - 2, 1);
    endPage = totalPages;
  } else {
    startPage = currentPage - 1;
    endPage = currentPage + 1;
  }

  if (endPage > totalPages) {
    endPage = totalPages;
  }

  if (totalPages > 5 && currentPage > 3) {
    var firstPage = document.createElement("button");
    firstPage.textContent = "1";
    firstPage.className = "page-number";
    firstPage.addEventListener("click", function () {
      currentPage = 1;
      fetchImages(currentPage);
    });
    pageNumberContainer.appendChild(firstPage);
  }

  for (var i = startPage; i <= endPage; i++) {
    var pageNumber = document.createElement("button");
    pageNumber.textContent = i;
    pageNumber.className = "page-number";
    if (i === currentPage) {
      pageNumber.classList.add("active");
    }
    pageNumber.addEventListener("click", function () {
      currentPage = parseInt(this.textContent);
      fetchImages(currentPage);
    });
    pageNumberContainer.appendChild(pageNumber);
  }

  if (totalPages > 5 && currentPage < totalPages - 2) {
    var lastPage = document.createElement("button");
    lastPage.textContent = totalPages;
    lastPage.className = "page-number";
    lastPage.addEventListener("click", function () {
      currentPage = totalPages;
      fetchImages(currentPage);
    });
    pageNumberContainer.appendChild(lastPage);
  }
}

function fetchImages(page) {
  var URL =
    "https://pixabay.com/api/?key=" +
    API_KEY +
    "&q=" +
    encodeURIComponent(searchQuery) +
    "&page=" +
    page;

  // Clear the image container
  imageContainer.innerHTML = "";

  // Display loading placeholders
  for (let i = 0; i < resultsPerPage; i++) {
    const placeholder = createImagePlaceholder();
    imageContainer.appendChild(placeholder);
  }

  $.getJSON(URL, function (data) {
    totalResults = parseInt(data.totalHits);
    totalPages = Math.ceil(totalResults / resultsPerPage);

    // Clear the image container
    imageContainer.innerHTML = "";

    if (totalResults > 0) {
      data.hits.forEach(function (hit) {
        var image = document.createElement("img");

        // Add a load event listener to replace the placeholder with the image
        image.addEventListener("load", function () {
          imageContainer.removeChild(placeholder); // Remove the placeholder
          imageContainer.appendChild(image); // Add the loaded image
        });

        // Add an error event listener to handle image load errors
        image.addEventListener("error", function () {
          console.log("Error loading image");
          // Optionally, you can handle error cases by displaying a different placeholder or an error message
        });

        // Set the source of the image to the API URL
        image.src = hit.webformatURL;
        image.alt = hit.tags;
        image.className = "img-thumbnail col-md-3  mt-3";

        // Create a placeholder and append it to the image container
        const placeholder = createImagePlaceholder();
        imageContainer.appendChild(placeholder);

        // Append the image to the image container
        imageContainer.appendChild(image);
      });
    } else {
      console.log("No hits");
    }

    updatePagination();

    if (currentPage > 1) {
      previousPageButton.disabled = false;
    } else {
      previousPageButton.disabled = true;
    }

    if (currentPage < totalPages) {
      nextPageButton.disabled = false;
    } else {
      nextPageButton.disabled = true;
    }

    totalPageContainer.textContent = totalPages;
  });
}

// Helper function to create a placeholder
function createImagePlaceholder() {
  const placeholder = document.createElement("img");
  placeholder.className = "img-thumbnail col-md-4 mt-3";
  placeholder.src = "images/loading.jpg";
  return placeholder;
}

previousPageButton.addEventListener("click", function (event) {
  event.preventDefault();
  if (currentPage > 1) {
    currentPage--;
    fetchImages(currentPage);
  }
});

nextPageButton.addEventListener("click", function (event) {
  event.preventDefault();
  if (currentPage < totalPages) {
    currentPage++;
    fetchImages(currentPage);
  }
});

fetchImages(currentPage);
