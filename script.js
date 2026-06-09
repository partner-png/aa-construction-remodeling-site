const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const contactForm = document.querySelector("[data-contact-form]");
const formNote = document.querySelector("[data-form-note]");
const galleryGrid = document.querySelector("[data-gallery-grid]");
const galleryStatus = document.querySelector("[data-gallery-status]");
const galleryFilterButtons = [...document.querySelectorAll("[data-gallery-filter]")];

const fallbackGalleryItems = [
  {
    id: "seed-kitchen",
    title: "Kitchen Remodel",
    caption: "Kitchen cabinetry, stone counters, tile backsplash, and lighting inspiration.",
    category: "kitchen",
    mediaType: "IMAGE",
    src: "assets/kitchen-remodel.png",
    permalink: "https://www.instagram.com/aaconstruction.inc/",
  },
  {
    id: "seed-bathroom",
    title: "Bathroom Renovation",
    caption: "Bathroom tile, glass shower, vanity, fixtures, and clean finish work.",
    category: "bathroom",
    mediaType: "IMAGE",
    src: "assets/bath-remodel.png",
    permalink: "https://www.instagram.com/aaconstruction.inc/",
  },
  {
    id: "seed-exterior",
    title: "Exterior Improvement",
    caption: "Exterior entry, porch, siding accents, door, and trim project inspiration.",
    category: "exterior",
    mediaType: "IMAGE",
    src: "assets/exterior-remodel.png",
    permalink: "https://www.instagram.com/aaconstruction.inc/",
  },
  {
    id: "seed-interior",
    title: "Interior Upgrade",
    caption: "Interior finish work, flooring, trim, living space, and room refresh inspiration.",
    category: "interior",
    mediaType: "IMAGE",
    src: "assets/hero-remodel.png",
    permalink: "https://www.instagram.com/aaconstruction.inc/",
  },
  {
    id: "seed-new-build",
    title: "New Build",
    caption: "New construction, ground-up build, framing, foundation, and finish work inspiration.",
    category: "new-builds",
    mediaType: "IMAGE",
    src: "assets/hero-remodel.png",
    permalink: "https://www.instagram.com/aaconstruction.inc/",
  },
  {
    id: "seed-addition",
    title: "Room Addition",
    caption: "Room addition, expanded living space, build-out, tie-in, and home expansion inspiration.",
    category: "additions",
    mediaType: "IMAGE",
    src: "assets/exterior-remodel.png",
    permalink: "https://www.instagram.com/aaconstruction.inc/",
  },
];

let galleryItems = fallbackGalleryItems;
let activeGalleryFilter = "all";

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation");
    }
  });
}

if (contactForm && formNote) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const message = [
      "Hi A&A Construction & Remodeling, I would like to talk about a project.",
      "",
      `Name: ${data.get("name")}`,
      `Phone: ${data.get("phone")}`,
      `Email: ${data.get("email")}`,
      `Project type: ${data.get("project")}`,
      `Message: ${data.get("message")}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(message);
      formNote.textContent = "Message copied. Open Instagram and paste it to start the conversation.";
    } catch {
      formNote.textContent = "Message is ready. Copy your details and send them through Instagram.";
    }
  });
}

function classifyGalleryItem(item) {
  if (item.category) return item.category;

  const text = `${item.title || ""} ${item.caption || ""}`.toLowerCase();
  const categories = [
    ["kitchen", ["kitchen", "cabinet", "counter", "backsplash", "island", "pantry", "sink"]],
    ["bathroom", ["bath", "bathroom", "shower", "vanity", "toilet", "tub", "waterproof"]],
    ["exterior", ["exterior", "siding", "porch", "entry", "door", "deck", "roof", "gutter", "fascia"]],
    ["interior", ["interior", "drywall", "paint", "flooring", "trim", "baseboard", "living", "bedroom"]],
    ["new-builds", ["new build", "new-build", "new construction", "ground up", "ground-up", "framing", "foundation"]],
    ["additions", ["addition", "room addition", "add-on", "add on", "build-out", "buildout", "expansion"]],
    ["repair", ["repair", "restore", "patch", "damage", "replace", "fix"]],
  ];

  return categories.find(([, keywords]) => keywords.some((keyword) => text.includes(keyword)))?.[0] || "interior";
}

function prettyCategory(category) {
  return {
    all: "All",
    kitchen: "Kitchen",
    bathroom: "Bathroom",
    interior: "Interior",
    exterior: "Exterior",
    "new-builds": "New Build",
    additions: "Room Addition",
    repair: "Repair",
  }[category] || "Project";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderGallery() {
  if (!galleryGrid) return;

  const filteredItems =
    activeGalleryFilter === "all"
      ? galleryItems
      : galleryItems.filter((item) => classifyGalleryItem(item) === activeGalleryFilter);

  galleryGrid.innerHTML = filteredItems
    .map((item) => {
      const category = classifyGalleryItem(item);
      const mediaType = (item.mediaType || item.media_type || "IMAGE").toUpperCase();
      const source = item.src || item.mediaUrl || item.media_url || item.thumbnailUrl || item.thumbnail_url;
      const poster = item.thumbnailUrl || item.thumbnail_url || source;
      const title = item.title || `${prettyCategory(category)} Project`;
      const caption = item.caption || "Latest A&A project media from Instagram.";
      const permalink = item.permalink || "https://www.instagram.com/aaconstruction.inc/";
      const media =
        mediaType === "VIDEO"
          ? `<video muted playsinline preload="metadata" poster="${escapeHtml(poster)}"><source src="${escapeHtml(source)}"></video>`
          : `<img src="${escapeHtml(source)}" alt="${escapeHtml(title)}">`;

      return `
        <article class="gallery-card" data-category="${escapeHtml(category)}">
          <a href="${escapeHtml(permalink)}" target="_blank" rel="noreferrer">
            ${media}
            <div class="gallery-card-copy">
              <div class="gallery-meta">
                <span class="media-chip">${escapeHtml(prettyCategory(category))}</span>
                ${mediaType === "VIDEO" ? '<span class="media-chip video">Video</span>' : ""}
              </div>
              <h3>${escapeHtml(title)}</h3>
              <p>${escapeHtml(caption)}</p>
            </div>
          </a>
        </article>
      `;
    })
    .join("");

  if (galleryStatus) {
    const label =
      activeGalleryFilter === "all"
        ? "project media items"
        : `${prettyCategory(activeGalleryFilter).toLowerCase()} items`;
    galleryStatus.textContent = `${filteredItems.length} ${label} loaded`;
  }
}

galleryFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeGalleryFilter = button.dataset.galleryFilter || "all";
    galleryFilterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    renderGallery();
  });
});

async function loadGalleryFeed() {
  if (!galleryGrid) return;

  try {
    const response = await fetch("data/gallery-feed.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Gallery feed unavailable");
    const feed = await response.json();
    galleryItems = Array.isArray(feed.items) && feed.items.length ? feed.items : fallbackGalleryItems;
  } catch {
    galleryItems = fallbackGalleryItems;
  }

  renderGallery();
}

loadGalleryFeed();
