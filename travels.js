// Keep map pins as data so rendering and hit-testing use the same coordinates.
const destinations = [
    { name: "Paris, France", type: "visited", latitude: 48.8566, longitude: 2.3522 },
    { name: "Cayenne, French Guiana", type: "visited", latitude: 4.9224, longitude: -52.3135 },
    { name: "Kourou, French Guiana", type: "visited", latitude: 5.1597, longitude: -52.6503 },
    { name: "Sinnamary, French Guiana", type: "visited", latitude: 5.3736, longitude: -52.9567 },
    { name: "Nepal", type: "visited", latitude: 28.3949, longitude: 84.124 },
    { name: "Kathmandu, Nepal", type: "visited", latitude: 27.7172, longitude: 85.324 },
    { name: "Pokhara, Nepal", type: "visited", latitude: 28.2096, longitude: 83.9856 },
    { name: "Geneva, Switzerland", type: "visited", latitude: 46.2044, longitude: 6.1432 },
    { name: "Bruxelles, Belgium", type: "visited", latitude: 50.8503, longitude: 4.3517 },
    { name: "Cologne, Germany", type: "visited", latitude: 50.9375, longitude: 6.9603 },
    { name: "Luxembourg, Luxembourg", type: "visited", latitude: 49.6116, longitude: 6.1319 },
    { name: "Calvi, France", type: "visited", latitude: 42.5667, longitude: 8.75 },
    { name: "Bastia, France", type: "visited", latitude: 42.6973, longitude: 9.4509 },
    { name: "Barcelona, Spain", type: "visited", latitude: 41.3874, longitude: 2.1686 },
    { name: "Cape Town, South Africa", type: "bucket", latitude: -33.9249, longitude: 18.4241 },
    { name: "New York, United States", type: "bucket", latitude: 40.7128, longitude: -74.006 },
    { name: "Tokyo, Japan", type: "bucket", latitude: 35.6762, longitude: 139.6503 },
    { name: "Seoul, South Korea", type: "bucket", latitude: 37.5665, longitude: 126.978 },
    { name: "Shanghai, China", type: "bucket", latitude: 31.2304, longitude: 121.4737 },
    { name: "Miami, United States", type: "bucket", latitude: 25.7617, longitude: -80.1918 }
];

// A lightweight fallback outline keeps the globe usable if its texture cannot load.
const landPolygons = [
    [[-168, 70], [-150, 72], [-132, 58], [-126, 50], [-124, 40], [-117, 32], [-108, 30], [-105, 23], [-98, 18], [-91, 16], [-86, 11], [-82, 9], [-78, 20], [-80, 25], [-75, 35], [-70, 45], [-60, 50], [-54, 60], [-65, 67], [-82, 72], [-100, 74], [-120, 72], [-140, 70], [-155, 74]],
    [[-82, 12], [-75, 10], [-68, 11], [-60, 7], [-51, 2], [-46, -7], [-38, -13], [-41, -23], [-49, -30], [-54, -37], [-64, -48], [-70, -55], [-76, -42], [-78, -25], [-80, -8]],
    [[-53, 60], [-45, 59], [-37, 65], [-28, 72], [-36, 82], [-49, 84], [-58, 78], [-62, 70]],
    [[-11, 36], [-10, 44], [-10, 52], [-6, 56], [-7, 61], [2, 63], [8, 70], [22, 72], [34, 68], [48, 69], [58, 66], [70, 71], [88, 72], [105, 69], [122, 60], [138, 55], [153, 60], [166, 58], [178, 51], [170, 44], [158, 42], [145, 39], [134, 34], [127, 29], [122, 22], [114, 18], [110, 10], [104, 3], [98, 10], [91, 22], [83, 8], [75, 8], [69, 19], [60, 25], [51, 28], [44, 36], [36, 36], [29, 41], [20, 40], [16, 36], [10, 37], [5, 43], [-2, 44], [-5, 41]],
    [[-17, 36], [-5, 37], [10, 34], [20, 32], [33, 30], [43, 12], [51, 11], [44, 2], [42, -12], [35, -22], [27, -34], [18, -35], [12, -26], [5, -5], [-2, 5], [-9, 5], [-15, 15], [-17, 28]],
    [[112, -11], [130, -11], [142, -16], [153, -27], [150, -39], [140, -44], [126, -42], [115, -34], [113, -22]],
    [[47, -13], [50, -16], [50, -25], [46, -26], [44, -18]],
    [[130, 32], [137, 34], [142, 40], [145, 44], [141, 45], [137, 41]],
    [[-8, 50], [-6, 55], [-3, 58], [0, 55], [1, 51], [-3, 50]],
    [[-180, -72], [-120, -72], [-60, -72], [0, -72], [60, -72], [120, -72], [180, -72], [180, -90], [-180, -90]]
];

const canvas = document.getElementById("travel-globe");
const context = canvas?.getContext("2d");
const tooltip = document.getElementById("globe-tooltip");
const mapImage = new Image();
const MIN_ZOOM = 0.82;
const MAX_ZOOM = 1.6;

let rotation = -18;
let tilt = 0;
let zoom = 1;
let dragging = false;
let lastPointerX = 0;
let lastPointerY = 0;
let pixelMap = [];
let countryMapData = null;

if (canvas && context && tooltip) {
    mapImage.addEventListener("load", () => {
        const mapCanvas = document.createElement("canvas");
        mapCanvas.width = mapImage.naturalWidth;
        mapCanvas.height = mapImage.naturalHeight;
        const mapContext = mapCanvas.getContext("2d", { willReadFrequently: true });
        if (!mapContext) {
            console.error("Could not create the country map texture.");
            return;
        }
        mapContext.drawImage(mapImage, 0, 0);
        countryMapData = mapContext.getImageData(0, 0, mapCanvas.width, mapCanvas.height);
        drawGlobe();
    });
    mapImage.addEventListener("error", () => {
        console.error("Could not load the country map texture.");
    });
    mapImage.src = "assets/world-countries.png";

    canvas.addEventListener("pointerdown", (event) => {
        dragging = true;
        tooltip.hidden = true;
        lastPointerX = event.clientX;
        lastPointerY = event.clientY;
        canvas.setPointerCapture(event.pointerId);
        canvas.classList.add("is-dragging");
    });

    canvas.addEventListener("pointermove", (event) => {
        if (!dragging) {
            updatePinTooltip(event);
            return;
        }
        const deltaX = event.clientX - lastPointerX;
        const deltaY = event.clientY - lastPointerY;
        rotation -= deltaX * 0.75;
        tilt = clamp(tilt - deltaY * 0.75, -85, 85);
        lastPointerX = event.clientX;
        lastPointerY = event.clientY;
        drawGlobe();
    });

    canvas.addEventListener("pointerup", (event) => {
        dragging = false;
        canvas.classList.remove("is-dragging");
        updatePinTooltip(event);
    });

    canvas.addEventListener("pointercancel", () => {
        dragging = false;
        canvas.classList.remove("is-dragging");
    });

    canvas.addEventListener("pointerleave", () => {
        if (!dragging) tooltip.hidden = true;
    });

    canvas.addEventListener("wheel", (event) => {
        event.preventDefault();
        zoom = clamp(zoom + (event.deltaY < 0 ? 0.08 : -0.08), MIN_ZOOM, MAX_ZOOM);
        drawGlobe();
    }, { passive: false });

    canvas.addEventListener("keydown", (event) => {
        if (event.key.startsWith("Arrow")) {
            event.preventDefault();
            if (event.key === "ArrowLeft") rotation -= 12;
            if (event.key === "ArrowRight") rotation += 12;
            if (event.key === "ArrowUp") tilt = clamp(tilt - 12, -85, 85);
            if (event.key === "ArrowDown") tilt = clamp(tilt + 12, -85, 85);
            drawGlobe();
        } else if (event.key === "+" || event.key === "=" || event.key === "-") {
            event.preventDefault();
            zoom = clamp(zoom + (event.key === "-" ? -0.08 : 0.08), MIN_ZOOM, MAX_ZOOM);
            drawGlobe();
        }
    });

    document.getElementById("zoom-in")?.addEventListener("click", () => {
        zoom = clamp(zoom + 0.1, MIN_ZOOM, MAX_ZOOM);
        drawGlobe();
    });
    document.getElementById("zoom-out")?.addEventListener("click", () => {
        zoom = clamp(zoom - 0.1, MIN_ZOOM, MAX_ZOOM);
        drawGlobe();
    });
    document.getElementById("reset-globe")?.addEventListener("click", () => {
        rotation = -18;
        tilt = 0;
        zoom = 1;
        drawGlobe();
    });

    drawGlobe();
}

function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
}

function isLand(longitude, latitude) {
    return landPolygons.some((polygon) => {
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const [xi, yi] = polygon[i];
            const [xj, yj] = polygon[j];
            const crossesLatitude = (yi > latitude) !== (yj > latitude);
            const intersection = ((xj - xi) * (latitude - yi)) / (yj - yi) + xi;
            if (crossesLatitude && longitude < intersection) inside = !inside;
        }
        return inside;
    });
}

function project(latitude, longitude, centerX, centerY, radius) {
    const lat = latitude * Math.PI / 180;
    const yaw = rotation * Math.PI / 180;
    const pitch = tilt * Math.PI / 180;
    const cosLatitude = Math.cos(lat);
    const worldX = Math.sin(longitude * Math.PI / 180) * cosLatitude;
    const worldY = Math.sin(lat);
    const worldZ = Math.cos(longitude * Math.PI / 180) * cosLatitude;
    const rotatedX = Math.cos(yaw) * worldX - Math.sin(yaw) * worldZ;
    const rotatedZ = Math.sin(yaw) * worldX + Math.cos(yaw) * worldZ;
    const screenY = Math.cos(pitch) * worldY - Math.sin(pitch) * rotatedZ;
    const depth = Math.sin(pitch) * worldY + Math.cos(pitch) * rotatedZ;
    // Points on the far side of the globe are hidden from view.
    if (depth < 0) return null;

    return {
        x: centerX + rotatedX * radius,
        y: centerY - screenY * radius,
        depth
    };
}

function drawGlobe() {
    if (!canvas || !context) return;
    const size = canvas.width;
    const center = size / 2;
    const radius = size * 0.41 * zoom;
    const pitch = tilt * Math.PI / 180;
    const yaw = rotation * Math.PI / 180;
    const cosPitch = Math.cos(pitch);
    const sinPitch = Math.sin(pitch);
    const cosYaw = Math.cos(yaw);
    const sinYaw = Math.sin(yaw);
    const image = context.createImageData(size, size);
    pixelMap = [];

    // Convert each visible canvas pixel back to latitude/longitude for the globe texture.
    for (let y = 0; y < size; y += 1) {
        for (let x = 0; x < size; x += 1) {
            const nx = (x + 0.5 - center) / radius;
            const ny = (center - y - 0.5) / radius;
            const distanceSquared = nx * nx + ny * ny;
            if (distanceSquared > 1) continue;

            const nz = Math.sqrt(1 - distanceSquared);
            const worldY = ny * cosPitch + nz * sinPitch;
            const rotatedZ = -ny * sinPitch + nz * cosPitch;
            const worldX = cosYaw * nx + sinYaw * rotatedZ;
            const worldZ = -sinYaw * nx + cosYaw * rotatedZ;
            const latitude = Math.asin(worldY) * 180 / Math.PI;
            const longitude = Math.atan2(worldX, worldZ) * 180 / Math.PI;
            const wrappedLongitude = ((longitude + 180) % 360 + 360) % 360 - 180;
            const offset = (y * size + x) * 4;
            let color;

            if (countryMapData) {
                const mapX = Math.floor(((wrappedLongitude + 180) / 360) * countryMapData.width) % countryMapData.width;
                const mapY = clamp(Math.floor(((90 - latitude) / 180) * countryMapData.height), 0, countryMapData.height - 1);
                const mapOffset = (mapY * countryMapData.width + mapX) * 4;
                const land = countryMapData.data[mapOffset + 3] > 128;
                const shade = 0.7 + nz * 0.3;
                color = land
                    ? [
                        countryMapData.data[mapOffset] * shade,
                        countryMapData.data[mapOffset + 1] * shade,
                        countryMapData.data[mapOffset + 2] * shade
                    ]
                    : [31 + nz * 28, 76 + nz * 28, 112 + nz * 28];
            } else {
                const land = isLand(wrappedLongitude, latitude);
                const shade = Math.round(25 + nz * 28);
                color = land ? [94 + shade, 119 + shade, 79 + shade] : [31 + shade, 76 + shade, 112 + shade];
            }

            image.data[offset] = color[0];
            image.data[offset + 1] = color[1];
            image.data[offset + 2] = color[2];
            image.data[offset + 3] = 255;
        }
    }

    context.putImageData(image, 0, 0);
    const projectedPins = destinations.map((destination, index) => ({
        index,
        point: project(destination.latitude, destination.longitude, center, center, radius)
    })).filter((pin) => pin.point);

    // Separate nearby markers slightly and retain their screen positions for tooltip hit-tests.
    pixelMap = projectedPins.map(({ index, point }) => {
        const nearbyPins = projectedPins.filter((pin) => Math.hypot(pin.point.x - point.x, pin.point.y - point.y) < 4);
        const clusterIndex = nearbyPins.findIndex((pin) => pin.index === index);
        const angle = clusterIndex * Math.PI * 2 / nearbyPins.length;
        const spread = nearbyPins.length > 1 ? 5 : 0;
        const markerX = point.x + Math.cos(angle) * spread;
        const markerY = point.y + Math.sin(angle) * spread;
        const destination = destinations[index];
        const color = destination.type === "visited" ? "#36df78" : "#ff535b";

        if (spread) {
            context.fillStyle = "#d3d9dd";
            context.fillRect(Math.round(point.x), Math.round(point.y), 1, 1);
            context.strokeStyle = color;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.lineTo(markerX, markerY);
            context.stroke();
        }

        context.beginPath();
        context.moveTo(markerX, markerY + 1);
        context.lineTo(markerX, markerY - 3);
        context.strokeStyle = "#111820";
        context.lineWidth = 4;
        context.stroke();
        context.strokeStyle = color;
        context.lineWidth = 2;
        context.stroke();

        context.beginPath();
        context.arc(markerX, markerY - 5, 4, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();
        context.strokeStyle = "#111820";
        context.lineWidth = 2;
        context.stroke();
        return { destination, x: markerX, y: markerY - 5 };
    });
}

function updatePinTooltip(event) {
    if (!canvas || !tooltip) return;
    const canvasBounds = canvas.getBoundingClientRect();
    const panelBounds = canvas.parentElement.getBoundingClientRect();
    const x = (event.clientX - canvasBounds.left) * canvas.width / canvasBounds.width;
    const y = (event.clientY - canvasBounds.top) * canvas.height / canvasBounds.height;
    // Scale pointer coordinates from CSS pixels to the canvas's internal resolution.
    const nearest = pixelMap
        .map((pin) => ({ ...pin, distance: Math.hypot(pin.x - x, pin.y - y) }))
        .filter((pin) => pin.distance < 7)
        .sort((a, b) => a.distance - b.distance)[0];
    if (!nearest) {
        tooltip.hidden = true;
        return;
    }

    tooltip.textContent = nearest.destination.name;
    tooltip.hidden = false;
    const tooltipWidth = tooltip.getBoundingClientRect().width;
    const pointX = canvasBounds.left - panelBounds.left + nearest.x * canvasBounds.width / canvas.width;
    const pointY = canvasBounds.top - panelBounds.top + nearest.y * canvasBounds.height / canvas.height;
    tooltip.style.left = `${clamp(pointX, tooltipWidth / 2 + 6, panelBounds.width - tooltipWidth / 2 - 6)}px`;
    tooltip.style.top = `${Math.max(pointY, tooltip.getBoundingClientRect().height + 12)}px`;
}
