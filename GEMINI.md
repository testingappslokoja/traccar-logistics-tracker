## Directory Overview

This directory contains the prompt and resources for developing a single-file web application that simulates an e-commerce logistics tracker. The application will feature a map-based, real-time tracking experience for a simulated delivery, with a mock implementation of a Traccar device and WebSocket for live location updates.

## Key Files

*   **`prompt.txt`**: This is the core requirements document for the project. It details the technical specifications, user flow, and simulation logic for the logistics tracker application. The application will be built using HTML, Tailwind CSS, and JavaScript, with Leaflet for mapping. A key aspect of the project is to simulate the behavior of a Traccar device and its data feed.

## Technology Focus: Traccar

[Traccar](https://www.traccar.org/) is an open-source GPS tracking platform. This project aims to simulate a key part of the Traccar ecosystem: a device reporting its location and a front-end application consuming that data. The `prompt.txt` specifically calls for a mock Traccar WebSocket to be implemented, which will feed the front-end with simulated location data.

## Usage

This directory is the designated workspace for creating the `logistics_tracker.html` file as specified in the `prompt.txt`. The end goal is to produce a single HTML file that fulfills all the requirements outlined in the prompt, including the simulation of the Traccar device and its real-time data feed.