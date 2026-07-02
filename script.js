const seedCampaigns = [
  {
    title: "LED Desk Lamp",
    category: "Home",
    duration: "5-10 min daily use",
    fit: "Home office, study desk, reading area",
    artClass: "art-lamp",
    description: "Adjustable lighting for workspaces, reading corners, and small apartments.",
    requirements: ["Use in your normal workspace", "Share your real experience with brightness and controls", "Only post opinions based on actual use"]
  },
  {
    title: "Insulated Travel Mug",
    category: "Kitchen",
    duration: "1-2 weeks",
    fit: "Commuters, office users, home coffee drinkers",
    artClass: "art-mug",
    description: "A daily mug test focused on temperature retention, lid comfort, and cleaning.",
    requirements: ["Use with hot or cold drinks", "Note any leaking or handling issues", "Share private usage notes"]
  },
  {
    title: "Wireless Earbuds",
    category: "Electronics",
    duration: "1-2 weeks",
    fit: "Calls, commuting, light workouts, music",
    artClass: "art-earbuds",
    description: "Compact earbuds for testing comfort, call clarity, battery life, and pairing.",
    requirements: ["Use with your phone or laptop", "Test calls and music playback", "Report comfort and battery impressions"]
  },
  {
    title: "Storage Organizer",
    category: "Home",
    duration: "1-2 weeks",
    fit: "Bathroom, closet, nursery, dorm, pantry",
    artClass: "art-organizer",
    description: "A multi-purpose organizer test for capacity, sturdiness, and daily usefulness.",
    requirements: ["Use in a real storage area", "Photograph setup only if comfortable", "Complete a short private survey"]
  },
  {
    title: "Sleep Eye Mask",
    category: "Wellness",
    duration: "7 nights",
    fit: "Travelers, shift workers, light sleepers",
    artClass: "art-mask",
    description: "A comfort-focused test for light blocking, fit, breathability, and fabric feel.",
    requirements: ["Use for several sleep sessions", "Share comfort notes", "Mention fit issues privately"]
  },
  {
    title: "Countertop Soap Dispenser",
    category: "Kitchen",
    duration: "1-2 weeks",
    fit: "Kitchen sink, bathroom sink, laundry room",
    artClass: "art-soap",
    description: "A household test for pump action, refill ease, stability, and finish quality.",
    requirements: ["Use with hand soap or dish soap", "Track daily usability", "Share your real product experience"]
  }
];

const grid = document.querySelector("#campaignGrid");
const filters = document.querySelectorAll(".filter");
const dialog = document.querySelector("#campaignDialog");
const dialogContent = document.querySelector("#dialogContent");
const closeDialog = document.querySelector(".dialog-close");
const productForm = document.querySelector("#productForm");
const productStatus = document.querySelector("#productStatus");
const adminGate = document.querySelector("#adminGate");
const adminKey = document.querySelector("#adminKey");
const unlockAdmin = document.querySelector("#unlockAdmin");
const adminStatus = document.querySelector("#adminStatus");
const storageKey = "realPeopleFeedbackCampaigns";
const uploadKey = "ttxs";

let campaigns = [...seedCampaigns, ...loadStoredCampaigns()];

function loadStoredCampaigns() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

function saveStoredCampaigns() {
  const customCampaigns = campaigns.filter((item) => item.isCustom);
  localStorage.setItem(storageKey, JSON.stringify(customCampaigns));
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return entities[char];
  });
}

function campaignVisual(item) {
  if (item.imageData) {
    return `<img class="custom-product-image" src="${item.imageData}" alt="${escapeHtml(item.title)}" loading="lazy">`;
  }
  return `<div class="product-art ${item.artClass || "art-organizer"}" role="img" aria-label="${escapeHtml(item.title)}"></div>`;
}

function renderCampaigns(category = "all") {
  const visible = category === "all" ? campaigns : campaigns.filter((item) => item.category === category);

  grid.innerHTML = visible
    .map(
      (item, index) => `
        <article class="campaign-card">
          ${campaignVisual(item)}
          <div class="campaign-body">
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
            <ul class="meta-list">
              <li>${escapeHtml(item.category)}</li>
              <li>${escapeHtml(item.duration)}</li>
              <li>${escapeHtml(item.fit)}</li>
            </ul>
            <button class="button secondary" type="button" data-campaign="${campaigns.indexOf(item)}">
              View Details & Apply
            </button>
          </div>
        </article>
      `
    )
    .join("");
}

function openCampaign(index) {
  const item = campaigns[index];
  dialogContent.innerHTML = `
    <div class="dialog-content">
      ${item.imageData ? `<img class="custom-product-image" src="${item.imageData}" alt="${escapeHtml(item.title)}">` : `<div class="product-art dialog-art ${item.artClass || "art-organizer"}" role="img" aria-label="${escapeHtml(item.title)}"></div>`}
      <div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
        <ul>
          <li><strong>Category:</strong> ${escapeHtml(item.category)}</li>
          <li><strong>Testing period:</strong> ${escapeHtml(item.duration)}</li>
          <li><strong>Best fit:</strong> ${escapeHtml(item.fit)}</li>
          ${item.productLink ? `<li><strong>Product link:</strong> <a href="${escapeHtml(item.productLink)}" target="_blank" rel="noreferrer">Open product page</a></li>` : ""}
          ${item.requirements.map((requirement) => `<li>${escapeHtml(requirement)}</li>`).join("")}
        </ul>
        <a class="button primary" href="#apply">Apply for this campaign</a>
      </div>
    </div>
  `;
  dialog.showModal();
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((filter) => filter.classList.remove("is-active"));
    button.classList.add("is-active");
    renderCampaigns(button.dataset.filter);
  });
});

grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-campaign]");
  if (!button) return;
  openCampaign(Number(button.dataset.campaign));
});

closeDialog.addEventListener("click", () => dialog.close());

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

dialog.addEventListener("click", (event) => {
  const applyLink = event.target.closest('a[href="#apply"]');
  if (!applyLink) return;
  dialog.close();
});

unlockAdmin.addEventListener("click", () => {
  if (adminKey.value.trim() !== uploadKey) {
    adminStatus.textContent = "Upload key is incorrect.";
    adminKey.focus();
    return;
  }
  productForm.classList.remove("is-hidden");
  adminGate.classList.add("is-hidden");
  productStatus.textContent = "Upload access unlocked for this browser session.";
});

function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

productForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(productForm);
  const file = data.get("productImage");
  const imageData = file && file.size > 0 ? await readImageAsDataUrl(file) : "";
  const productName = data.get("productName").toString().trim();
  const category = data.get("productCategory").toString();
  const duration = data.get("productDuration").toString().trim();
  const fit = data.get("productFit").toString().trim();
  const description = data.get("productDescription").toString().trim();
  const productLink = data.get("productLink").toString().trim();
  const keywords = data.get("productKeywords").toString().trim();

  campaigns.unshift({
    title: productName,
    category,
    duration,
    fit,
    description,
    productLink,
    keywords,
    imageData,
    artClass: "art-organizer",
    isCustom: true,
    requirements: [
      "Use the product naturally during the testing period",
      "Share your real experience about quality, packaging, and usability",
      "Never submit fake, scripted, or copied reviews"
    ]
  });

  saveStoredCampaigns();
  renderCampaigns(document.querySelector(".filter.is-active").dataset.filter);
  productStatus.textContent = "Campaign added to this browser. It is now visible in Current Product Campaigns.";
  productForm.reset();
});

renderCampaigns();
