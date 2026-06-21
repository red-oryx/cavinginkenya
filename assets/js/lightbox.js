(function () {
	"use strict";

	var links = Array.prototype.slice.call(document.querySelectorAll(".imageGallery a[href$='.jpg'], .imageGallery a[href$='.jpeg'], .imageGallery a[href$='.png']"));

	if (!links.length) {
		return;
	}

	var currentIndex = 0;
	var lastFocusedElement = null;

	var lightbox = document.createElement("div");
	lightbox.className = "site-lightbox";
	lightbox.setAttribute("role", "dialog");
	lightbox.setAttribute("aria-modal", "true");
	lightbox.setAttribute("aria-label", "Image gallery");
	lightbox.innerHTML = [
		'<button class="site-lightbox__button site-lightbox__close" type="button" aria-label="Close image">&times;</button>',
		'<button class="site-lightbox__button site-lightbox__prev" type="button" aria-label="Previous image">&#8249;</button>',
		'<figure class="site-lightbox__figure">',
		'<img class="site-lightbox__image" alt="">',
		'<figcaption class="site-lightbox__caption"></figcaption>',
		'</figure>',
		'<button class="site-lightbox__button site-lightbox__next" type="button" aria-label="Next image">&#8250;</button>'
	].join("");
	document.body.appendChild(lightbox);
	document.body.classList.add("lightbox-enabled");

	var image = lightbox.querySelector(".site-lightbox__image");
	var caption = lightbox.querySelector(".site-lightbox__caption");
	var closeButton = lightbox.querySelector(".site-lightbox__close");
	var prevButton = lightbox.querySelector(".site-lightbox__prev");
	var nextButton = lightbox.querySelector(".site-lightbox__next");

	function imageLabel(link, index) {
		var img = link.querySelector("img");
		return (img && img.getAttribute("alt") && img.getAttribute("alt") !== "Picture") ? img.getAttribute("alt") : "Photo " + (index + 1) + " of " + links.length;
	}

	function show(index) {
		currentIndex = (index + links.length) % links.length;
		var link = links[currentIndex];
		var label = imageLabel(link, currentIndex);

		image.src = link.href;
		image.alt = label;
		caption.textContent = label;
	}

	function open(index) {
		lastFocusedElement = document.activeElement;
		show(index);
		lightbox.classList.add("is-open");
		document.body.classList.add("lightbox-open");
		closeButton.focus();
	}

	function close() {
		lightbox.classList.remove("is-open");
		document.body.classList.remove("lightbox-open");
		image.removeAttribute("src");

		if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
			lastFocusedElement.focus();
		}
	}

	function next() {
		show(currentIndex + 1);
	}

	function previous() {
		show(currentIndex - 1);
	}

	links.forEach(function (link, index) {
		link.addEventListener("click", function (event) {
			event.preventDefault();
			open(index);
		});
	});

	closeButton.addEventListener("click", close);
	nextButton.addEventListener("click", next);
	prevButton.addEventListener("click", previous);

	lightbox.addEventListener("click", function (event) {
		if (event.target === lightbox) {
			close();
		}
	});

	document.addEventListener("keydown", function (event) {
		if (!lightbox.classList.contains("is-open")) {
			return;
		}

		if (event.key === "Escape") {
			close();
		} else if (event.key === "ArrowRight") {
			next();
		} else if (event.key === "ArrowLeft") {
			previous();
		}
	});
})();
