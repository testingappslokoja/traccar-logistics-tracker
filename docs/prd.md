# E-commerce Logistics Tracker Simulation Product Requirements Document (PRD)

## 1. Goals and Background Context

#### Goals
*   To define the functional and non-functional requirements for the E-commerce Logistics Tracker MVP.
*   To translate the project's commercial objectives into a concrete set of features and user stories.
*   To provide a clear, actionable guide for the Architect, UX Expert, and Development team.
*   To establish a shared understanding of the MVP's scope and success criteria among all stakeholders.

#### Background Context
This project aims to create a lightweight, single-file simulation of an e-commerce logistics platform as a Minimum Viable Product (MVP). The primary goal of this MVP is to validate market demand for a simple, affordable tracking solution targeted at small to medium-sized businesses. While the initial build is a self-contained simulation (mocking a Traccar device feed), the long-term vision is to evolve this into a full-featured, multi-tenant SaaS product. This PRD focuses exclusively on the requirements for the initial MVP simulation.

#### Change Log
| Date       | Version | Description                | Author |
|------------|---------|----------------------------|--------|
| 2025-09-28 | 1.0     | Initial draft of the PRD.  | John (PM) |

## 2. Requirements

#### Functional Requirements
1.  **FR1:** The system must present a simulated authentication screen with a single "Login / Sign Up" button.
2.  **FR2:** Upon login, the system must display a shopping screen with a list of mock products.
3.  **FR3:** Users must be able to add one or more products to a shopping cart.
4.  **FR4:** The system must display a running total of the items in the cart.
5.  **FR5:** Users must be able to proceed to a checkout screen that summarizes the order, including subtotal, tax, and a total.
6.  **FR6:** Confirming the order on the checkout screen must transition the user to the Real-Time Tracking screen.
7.  **FR7:** The tracking screen must display a map (via Leaflet) with a static marker for the customer's destination and a dynamic marker for the driver.
8.  **FR8:** The system must simulate a mock Traccar WebSocket feed, updating the driver's position every 2 seconds to move it linearly toward the destination.
9.  **FR9:** The map must automatically pan to keep the driver marker in view.
10. **FR10:** The UI must display the current order status text (e.g., "Picked Up," "En Route," "Delivered!"), which updates based on the simulation's progress.
11. **FR11:** Upon delivery, the simulation must stop, and a "View Past Orders" button must become visible to reset the flow.

#### Non-Functional Requirements
1.  **NFR1:** The entire application, including all HTML, CSS, and JavaScript, must be contained within a single HTML file.
2.  **NFR2:** All external libraries (Tailwind CSS, Leaflet.js) must be loaded from a public CDN.
3.  **NFR3:** The application must use `localStorage` to persist user login status and cart contents between sessions.
4.  **NFR4:** All user notifications (e.g., login success, order confirmed) must be displayed in a custom-styled modal and must not use native browser `alert()` or `confirm()` dialogs.
5.  **NFR5:** The application must be responsive and function correctly on modern desktop and mobile web browsers.
6.  **NFR6:** The UI animations and map updates must be smooth and performant, not causing lag or freezing the browser.

## 3. User Interface Design Goals

#### Overall UX Vision
The user experience should be clean, modern, and intuitive. The primary goal is clarity and ease of use, allowing a first-time user to navigate the entire flow without any confusion. The design should feel professional and polished, reflecting a credible, albeit simulated, e-commerce and logistics platform.

#### Key Interaction Paradigms
The application will follow standard and universally understood e-commerce web conventions. This includes a familiar "add to cart" mechanism, a straightforward multi-stage checkout process, and a map interface that behaves similarly to popular apps like Google Maps or Uber.

#### Core Screens and Views
1.  Authentication Screen (Login)
2.  Shopping Screen (Product Listing & Cart)
3.  Checkout Screen (Order Summary)
4.  Real-Time Tracking Screen (Map View)

#### Accessibility
WCAG AA

#### Branding
The design will be minimalist and brand-agnostic, using a clean, modern color palette (e.g., blues, greys, and whites) and standard sans-serif web fonts. The focus is on usability, not a specific brand identity.

#### Target Device and Platforms
Web Responsive

## 4. Technical Assumptions

#### Repository Structure
Monorepo. While the initial MVP is a single file, adopting a monorepo structure from the start will make it easier to manage the transition to a full-stack application with separate frontend and backend packages in Phase 2.

#### Service Architecture
Monolith. For the commercial product (Phase 2), we will begin with a monolithic backend service. This approach simplifies development, deployment, and testing in the early stages. We can refactor to microservices later if and when the complexity of the application warrants it.

#### Testing Requirements
Unit + Integration. For the commercial product (Phase 2), the backend will require both unit tests for individual functions and integration tests for API endpoints. The frontend will have unit tests for components and business logic. End-to-end testing will be considered post-Phase 2.

#### Additional Technical Assumptions and Requests
*   The initial MVP simulation **must** be written in plain, vanilla JavaScript, as per the project constraints. No external frameworks like React, Vue, or Angular are permitted for the MVP.
*   All dependencies for the MVP must be loaded via CDN to avoid requiring a build process.

## 5. Epic List

1.  **Epic 1: Foundational Setup & E-Commerce Flow:** Establish the core HTML structure and styling, and implement the complete user flow from the simulated login through adding items to the cart.
2.  **Epic 2: Checkout Process & Real-Time Tracking Simulation:** Implement the checkout screen and the core map-based, real-time Traccar tracking simulation.

## Epic 1: Foundational Setup & E-Commerce Flow

This epic focuses on establishing the project's foundational structure and implementing the complete front-end experience for the e-commerce portion of the application. By the end of this epic, a user will be able to "log in," view a list of mock products, and add them to a persistent shopping cart, fully preparing the application for the checkout and tracking simulation to be built in Epic 2.

#### Story 1.1: Initial HTML Structure & View Management
*As a developer, I want to create the main HTML file with all necessary CDN dependencies and a basic JavaScript structure for managing views, so that I have a foundation for building the application's different screens.*

**Acceptance Criteria:**
1.  An `index.html` file is created.
2.  The HTML file includes the correct CDN links for Tailwind CSS and Leaflet.js (both CSS and JS).
3.  The `<body>` contains distinct `<div>` elements for each of the four main application views (Auth, Shopping, Checkout, Tracking).
4.  A basic JavaScript function is implemented to show a specified view `<div>` while hiding the others.
5.  By default, only the "Authentication" view is visible when the page loads.

#### Story 1.2: Simulated Authentication
*As a user, I want to see a login screen and be able to click a single button to "log in," so that I can begin the shopping experience.*

**Acceptance Criteria:**
1.  The "Authentication" view contains a title and a single "Login / Sign Up" button.
2.  Clicking the button sets a flag in `localStorage` indicating the user is logged in.
3.  After clicking the button, the application transitions to show the "Shopping" view.
4.  If a user is already logged in (i.e., the flag exists in `localStorage` when the page loads), the application should bypass the "Authentication" view and show the "Shopping" view directly.

#### Story 1.3: Shopping Screen UI & Cart Display
*As a user, I want to see a list of mock products and a section for my shopping cart, so that I can decide what to order.*

**Acceptance Criteria:**
1.  The "Shopping" view is implemented.
2.  A list of at least 3-4 mock products is displayed. Each product should show a name, a price, and an "Add to Cart" button.
3.  A cart summary section is visible on the screen.
4.  The cart summary displays the current number of items and the running total price.
5.  A "Checkout" button is visible.

#### Story 1.4: Cart Functionality
*As a user, I want to be able to add items to my cart and see the cart summary update, so that I can track my order before checkout.*

**Acceptance Criteria:**
1.  Clicking an "Add to Cart" button for a product adds it to the cart.
2.  The cart's contents are stored in `localStorage`.
3.  After an item is added, the cart summary UI updates to reflect the new item count and total price.
4.  When the page is reloaded, the cart summary correctly reflects the contents of `localStorage`.

## Epic 2: Checkout Process & Real-Time Tracking Simulation

This epic delivers the core value proposition of the project. It builds on the foundation of Epic 1 by implementing the checkout process and, most importantly, the live tracking simulation. By the end of this epic, the application will be a complete, end-to-end simulation, fulfilling all primary requirements of the MVP.

#### Story 2.1: Checkout Screen
*As a user, I want to proceed to a checkout screen from my cart, so that I can review and confirm my final order.*

**Acceptance Criteria:**
1.  Clicking the "Checkout" button on the Shopping screen transitions the user to the "Checkout" view.
2.  The Checkout view displays a summary of the order, pulling data from `localStorage` (subtotal, a calculated tax, a fixed delivery fee, and a final total).
3.  A "Confirm & Place Order" button is displayed.
4.  Clicking the "Confirm & Place Order" button transitions the user to the "Tracking" view.

#### Story 2.2: Map Initialization & Destination Marker
*As a developer, I want to initialize the Leaflet map on the tracking screen and display a static marker for the customer's destination, so that the basic tracking environment is ready.*

**Acceptance Criteria:**
1.  When the "Tracking" view becomes visible, a Leaflet map is initialized within a `<div>`.
2.  A static marker (e.g., a pin icon) is placed on the map at a fixed latitude and longitude to represent the customer's destination.
3.  The map's initial center and zoom level are set appropriately to show the destination area.

#### Story 2.3: Tracking Simulation Logic
*As a developer, I want to create the core JavaScript logic for the mock Traccar WebSocket, so that I have a data feed of simulated driver locations.*

**Acceptance Criteria:**
1.  A function `startMockTraccarWebSocket` is created.
2.  When called, this function starts a `setInterval` loop that runs every 2 seconds.
3.  Inside the loop, a new latitude and longitude are calculated, moving a point linearly from a fixed starting location toward the fixed destination location.
4.  The function stores the current simulated driver location in a JavaScript variable.
5.  The loop includes a mechanism to stop itself once the driver has reached the destination.

#### Story 2.4: Live Map & Status Updates
*As a user, I want to see the driver's location moving on the map in real-time and receive status updates, so that I can track my delivery.*

**Acceptance Criteria:**
1.  When the tracking screen loads, a dynamic marker (e.g., a car icon) is placed on the map at the simulation's starting point.
2.  The `startMockTraccarWebSocket` function is called.
3.  On each interval of the simulation, the driver marker's position on the map is updated to the new coordinates.
4.  The Leaflet map automatically pans to follow the driver's marker.
5.  The on-screen order status text is updated based on the simulation's progress (e.g., "En Route," "Driver is 10 seconds away!").

#### Story 2.5: Delivery Completion & Reset
*As a user, I want to be notified when my order is delivered and have the option to start over, so that the simulation flow is complete.*

**Acceptance Criteria:**
1.  When the simulation's `setInterval` loop stops (i.e., the driver reaches the destination), the on-screen status is updated to "Delivered!".
2.  A "View Past Orders" button becomes visible.
3.  Clicking the "View Past Orders" button clears the relevant `localStorage` data (cart, order status) and transitions the user back to the "Shopping" screen, effectively resetting the simulation.
