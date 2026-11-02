const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');
const loadingIndicator = document.getElementById('lodaing-indicator'); // Might be removed in HTML, but safe to keep ref null check or remove
const starInfoPanel = document.getElementById('star-info');
const starNameEl = document.getElementById('star-name');
const starConstellationEl = document.getElementById('star-constellation');
const starMagEl = document.getElementById('star-mag');
const constellationDescEl = document.getElementById('constellation-desc');

let stars = [];
let constellationMap = {}; // Map: Name -> Description
let width, height;
let scale = 1.0;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let startX, startY;
let hoveredStar = null;
let bgImage = new Image();
let bgLoaded = false;
let calScale = 0.28; // Initial Guess
let calX = 0;
let calY = 0;
let calOpacity = 0.5;
let calRotation = 47; // Initial Guess
let highlightedStars = []; // For calibration visualization

// Configuration
const BASE_SCALE = 2.0;
const STAR_BASE_RADIUS = 2;

function loadData() {
    bgImage.src = 'Wood old skymap.jpg';
    bgImage.onload = () => {
        bgLoaded = true;
        draw();
    };

    // Load Constellation Descriptions
    fetch('constellations.json')
        .then(res => res.json())
        .then(data => {
            data.forEach(item => {
                // Normalize name: "각(角)" -> "각"
                const name = item.name.split('(')[0];
                const hanja = item.name.match(/\(([^)]+)\)/)?.[1] || '';
                const key = name.trim();
                const affiliationIdx = item.index; // Optional: use index or affiliation

                const meaning = item.meaning || '';
                if (key) constellationMap[key] = meaning;

                // Also store by full name just in case
                const fullKey = item.name.trim();
                if (fullKey !== key) constellationMap[fullKey] = meaning;
            });
            console.log("Constellation map loaded:", Object.keys(constellationMap).length);
        })
        .catch(err => console.error("Failed to load constellations.json", err));

    try {
        if (typeof starData === 'undefined') {
            throw new Error('Data not found. Make sure star_data.js is loaded.');
        }

        stars = starData
            .filter(d => d.x && d.y)
            .map(d => ({
                ...d,
                x: parseFloat(d.x),
                y: parseFloat(d.y),
                mag: parseFloat(d.V) || 6.0
            }));

        if (loadingIndicator) loadingIndicator.style.opacity = 0;
        init();
        populateCalibrationSelects();
    } catch (err) {
        console.error(err);
        if (loadingIndicator) loadingIndicator.innerText = 'Error loading data: ' + err.message;
    }
}

function init() {
    resize();
    window.addEventListener('resize', resize);

    // Interaction
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel);

    document.getElementById('zoomIn').addEventListener('click', () => zoom(1.2));
    document.getElementById('zoomOut').addEventListener('click', () => zoom(1 / 1.2));
    document.getElementById('resetView').addEventListener('click', resetView);

    // Calibration Controls
    document.getElementById('cal-scale').addEventListener('input', (e) => { calScale = parseFloat(e.target.value); draw(); });
    document.getElementById('cal-x').addEventListener('input', (e) => { calX = parseFloat(e.target.value); draw(); });
    document.getElementById('cal-y').addEventListener('input', (e) => { calY = parseFloat(e.target.value); draw(); });
    document.getElementById('cal-opacity').addEventListener('input', (e) => { calOpacity = parseFloat(e.target.value); draw(); });
    document.getElementById('cal-rotation').addEventListener('input', (e) => { calRotation = parseFloat(e.target.value); draw(); });

    document.getElementById('log-calibration').addEventListener('click', showCalibrationModal);
    document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('modal-overlay').classList.add('hidden');
    });

    initAutoCalibration();
    fitToScreen();
    animate();
}

// Calibration Global State
let calMode = null; // 'p1' or 'p2'
let calP1 = null; // { x, y } (World Coords)
let calP2 = null; // { x, y } (World Coords)

function initAutoCalibration() {
    const p1Btn = document.getElementById('set-p1-btn');
    const p2Btn = document.getElementById('set-p2-btn');
    const calcBtn = document.getElementById('calc-calibration-btn');
    const s1Select = document.getElementById('ref-star-1');
    const s2Select = document.getElementById('ref-star-2');

    p1Btn.addEventListener('click', () => {
        calMode = 'p1';
        p1Btn.innerText = 'Click Star on Map...';
        p2Btn.innerText = 'Set P2 (Click Map)';
        canvas.style.cursor = 'crosshair';
    });

    p2Btn.addEventListener('click', () => {
        calMode = 'p2';
        p2Btn.innerText = 'Click Star on Map...';
        p1Btn.innerText = 'Set P1 (Click Map)';
        canvas.style.cursor = 'crosshair';
    });

    calcBtn.addEventListener('click', () => {
        performCalibration();
        saveSettings();
    });

    document.getElementById('save-settings-btn').addEventListener('click', () => {
        saveSettings();
        document.getElementById('calibration-msg').innerText = "Settings Saved!";
        setTimeout(() => document.getElementById('calibration-msg').innerText = "", 2000);
    });

    document.getElementById('reset-settings-btn').addEventListener('click', () => {
        localStorage.removeItem('starMapSettings');
        location.reload();
    });

    // Highlight logic
    const updateHighlight = () => {
        const idx1 = s1Select.value;
        const idx2 = s2Select.value;
        const star1 = stars[idx1];
        const star2 = stars[idx2];
        highlightedStars = [star1, star2].filter(s => s);
        draw();
    };

    s1Select.addEventListener('change', updateHighlight);
    s2Select.addEventListener('change', updateHighlight);

    loadSettings();
    setTimeout(updateHighlight, 500);
}

function saveSettings() {
    const settings = {
        calScale, calX, calY, calOpacity, calRotation,
        scale, offsetX, offsetY
    };
    localStorage.setItem('starMapSettings', JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem('starMapSettings');
    if (saved) {
        try {
            const s = JSON.parse(saved);
            if (s.calScale !== undefined) calScale = s.calScale;
            if (s.calX !== undefined) calX = s.calX;
            if (s.calY !== undefined) calY = s.calY;
            if (s.calOpacity !== undefined) calOpacity = s.calOpacity;
            if (s.calRotation !== undefined) calRotation = s.calRotation;
            if (s.scale !== undefined) scale = s.scale;
            if (s.offsetX !== undefined) offsetX = s.offsetX;
            if (s.offsetY !== undefined) offsetY = s.offsetY;

            document.getElementById('cal-scale').value = calScale;
            document.getElementById('cal-x').value = calX;
            document.getElementById('cal-y').value = calY;
            document.getElementById('cal-opacity').value = calOpacity;
            document.getElementById('cal-rotation').value = Math.round(calRotation);

            draw();
            console.log("Settings loaded");
        } catch (e) {
            console.error("Failed to load settings", e);
        }
    }
}

function populateCalibrationSelects() {
    const s1 = document.getElementById('ref-star-1');
    const s2 = document.getElementById('ref-star-2');
    s1.innerHTML = '';
    s2.innerHTML = '';

    const brightStars = stars
        .filter(s => s.mag < 2.5 && (s.Name || s["별자리"]))
        .sort((a, b) => a.mag - b.mag);

    brightStars.forEach(s => {
        const name = `[${s["통합번호"]}] ${s.Name || ''} ${s["별자리"] || ''} (${s.mag})`;
        const opt1 = document.createElement('option');
        opt1.value = stars.indexOf(s);
        opt1.text = name;
        s1.appendChild(opt1);

        const opt2 = document.createElement('option');
        opt2.value = stars.indexOf(s);
        opt2.text = name;
        s2.appendChild(opt2);
    });
}

function performCalibration() {
    if (!calP1 || !calP2) {
        document.getElementById('calibration-msg').innerText = "Set both points first.";
        return;
    }

    const idx1 = document.getElementById('ref-star-1').value;
    const idx2 = document.getElementById('ref-star-2').value;
    const star1 = stars[idx1];
    const star2 = stars[idx2];

    if (!star1 || !star2) return;
    if (idx1 === idx2) {
        document.getElementById('calibration-msg').innerText = "Select different stars.";
        return;
    }

    // Data Vector
    const dx = star2.x - star1.x;
    const dy = star2.y - star1.y;
    const dataLen = Math.hypot(dx, dy);
    const dataAng = Math.atan2(dy, dx);

    // Click Vector
    const wx1 = calP1.x;
    const wy1 = calP1.y;
    const wx2 = calP2.x;
    const wy2 = calP2.y;

    const clickDx = wx2 - wx1;
    const clickDy = wy2 - wy1;
    const clickLen = Math.hypot(clickDx, clickDy);
    const clickAng = Math.atan2(clickDy, clickDx);

    console.log("Calibration Debug:",
        { star1, star2, calP1, calP2, dataLen, clickLen, dataAng, clickAng });

    if (clickLen < 1) {
        document.getElementById('calibration-msg').innerText = "Points too close/identical!";
        return;
    }

    // 1. Rotation
    const rotRad = clickAng - dataAng;
    let rotDeg = rotRad * 180 / Math.PI;
    rotDeg = (rotDeg + 360) % 360;
    calRotation = rotDeg;

    // 2. Scale
    const ratio = dataLen / clickLen;
    calScale = calScale * ratio;

    // 3. Translation
    const rad = calRotation * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const rx1 = star1.x * cos - star1.y * sin;
    const ry1 = star1.x * sin + star1.y * cos;

    // Current Image Center in World Space (calY is inverted screen-like Y)
    const imgWx = calX;
    const imgWy = -calY;

    const relP1x = calP1.x - imgWx;
    const relP1y = calP1.y - imgWy;

    const newRelP1x = relP1x * ratio;
    const newRelP1y = relP1y * ratio;

    const newImgWx = rx1 - newRelP1x;
    const newImgWy = ry1 - newRelP1y;

    calX = newImgWx;
    calY = -newImgWy;

    // Update UI
    document.getElementById('cal-rotation').value = Math.round(calRotation);
    document.getElementById('cal-scale').value = calScale;
    document.getElementById('cal-x').value = Math.round(calX);
    document.getElementById('cal-y').value = Math.round(calY);

    draw();
    document.getElementById('calibration-msg').innerText = `Aligned! Rot: ${Math.round(rotDeg)}°`;
    calMode = null;
    document.getElementById('set-p1-btn').innerText = "Set P1";
    document.getElementById('set-p2-btn').innerText = "Set P2";
    canvas.style.cursor = 'default';
}

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    draw();
}

function fitToScreen() {
    if (stars.length === 0) return;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    stars.forEach(s => {
        if (s.x < minX) minX = s.x;
        if (s.x > maxX) maxX = s.x;
        if (s.y < minY) minY = s.y;
        if (s.y > maxY) maxY = s.y;
    });

    const dataWidth = maxX - minX;
    const dataHeight = maxY - minY;

    const scaleX = (width * 0.9) / dataWidth;
    const scaleY = (height * 0.9) / dataHeight;
    scale = Math.min(scaleX, scaleY);

    // Left align logic
    offsetX = width * 0.4;
    offsetY = height / 2;

    draw();
}

function resetView() {
    fitToScreen();
}

function worldToScreen(wx, wy) {
    return {
        x: offsetX + (wx * scale),
        y: offsetY - (wy * scale)
    };
}

function screenToWorld(sx, sy) {
    return {
        x: (sx - offsetX) / scale,
        y: -(sy - offsetY) / scale
    };
}

function draw() {
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg-color');
    ctx.fillRect(0, 0, width, height);

    // Background
    if (bgLoaded) {
        ctx.globalAlpha = calOpacity;
        const imgW = bgImage.width * scale * calScale;
        const imgH = bgImage.height * scale * calScale;
        const imgCX = offsetX + (calX * scale);
        const imgCY = offsetY + (calY * scale);
        ctx.drawImage(bgImage, imgCX - imgW / 2, imgCY - imgH / 2, imgW, imgH);
        ctx.globalAlpha = 1.0;
    }

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.beginPath();
    ctx.moveTo(0, offsetY); ctx.lineTo(width, offsetY);
    ctx.moveTo(offsetX, 0); ctx.lineTo(offsetX, height);
    ctx.stroke();

    const rad = calRotation * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const getScreenPos = (star) => {
        const rx = star.x * cos - star.y * sin;
        const ry = star.x * sin + star.y * cos;
        return worldToScreen(rx, ry);
    };

    // Constellations
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    const constellations = {};
    stars.forEach(star => {
        if (star["별자리"]) {
            if (!constellations[star["별자리"]]) constellations[star["별자리"]] = [];
            constellations[star["별자리"]].push(star);
        }
    });

    Object.values(constellations).forEach(group => {
        group.sort((a, b) => (parseInt(a["*"]) || 0) - (parseInt(b["*"]) || 0));
        if (group.length > 1) {
            ctx.beginPath();
            let firstPoint = true;
            let prevStar = null;
            group.forEach(star => {
                const pos = getScreenPos(star);
                if (firstPoint) {
                    ctx.moveTo(pos.x, pos.y);
                    firstPoint = false;
                    prevStar = star;
                } else {
                    const dist = Math.hypot(star.x - prevStar.x, star.y - prevStar.y);
                    if (dist < 100) ctx.lineTo(pos.x, pos.y);
                    else { ctx.stroke(); ctx.beginPath(); ctx.moveTo(pos.x, pos.y); }
                    prevStar = star;
                }
            });
            ctx.stroke();
        }
    });
    ctx.restore();

    // Stars
    ctx.save();
    stars.forEach(star => {
        const pos = getScreenPos(star);
        if (pos.x < -20 || pos.x > width + 20 || pos.y < -20 || pos.y > height + 20) return;

        let r = Math.max(0.5, (6 - star.mag) * 0.8);
        r *= Math.sqrt(scale) * 0.5;
        if (r < 0.5) r = 0.5;

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);

        if (star === hoveredStar) {
            ctx.fillStyle = '#ff3366';
            ctx.shadowColor = '#ff3366';
            ctx.shadowBlur = 10;
        } else {
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 0;
        }
        ctx.fill();

        if (star.mag < 2 && scale > 1) {
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = '10px serif';
            ctx.fillText(star.Name || star["별자리"], pos.x + 5, pos.y - 5);
        }
    });
    ctx.restore();

    // Highlights (Selected Star by User Click)
    if (selectedStar) {
        ctx.save();
        const pos = getScreenPos(selectedStar);
        ctx.strokeStyle = '#ffd700'; // Gold
        ctx.lineWidth = 2;
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    // Highlights (Selected Reference Stars)
    if (highlightedStars.length > 0) {
        ctx.save();
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 10;
        highlightedStars.forEach(star => {
            const pos = getScreenPos(star);
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2); // Circle around star
            ctx.stroke();

            // Crosshair
            ctx.beginPath();
            ctx.moveTo(pos.x - 12, pos.y); ctx.lineTo(pos.x + 12, pos.y);
            ctx.moveTo(pos.x, pos.y - 12); ctx.lineTo(pos.x, pos.y + 12);
            ctx.stroke();
        });
        ctx.restore();
    }

    // Calibration Markers (User Clicks)
    if (calP1) {
        const s1 = worldToScreen(calP1.x, calP1.y);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(s1.x - 4, s1.y - 4, 8, 8);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText("P1", s1.x + 8, s1.y);
    }
    if (calP2) {
        const s2 = worldToScreen(calP2.x, calP2.y);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(s2.x - 4, s2.y - 4, 8, 8);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText("P2", s2.x + 8, s2.y);
    }
}

function showCalibrationModal() {
    const textInfo = `Scale: ${calScale}\nX: ${calX}\nY: ${calY}\nOpacity: ${calOpacity}\nRotation: ${calRotation}`;
    document.getElementById('result-text').value = textInfo;
    document.getElementById('modal-overlay').classList.remove('hidden');
    document.getElementById('result-text').select();
}

let selectedStar = null; // New global

let clickStartX = 0;
let clickStartY = 0;

function onMouseDown(e) {
    // Calibration Click Handler
    if (calMode === 'p1' || calMode === 'p2') {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const worldPos = screenToWorld(mx, my);

        if (calMode === 'p1') {
            calP1 = worldPos;
            document.getElementById('p1-status').innerText = `Set`;
            document.getElementById('p1-status').style.color = '#4caf50';
            document.getElementById('set-p1-btn').innerText = "Set P1";
        } else {
            calP2 = worldPos;
            document.getElementById('p2-status').innerText = `Set`;
            document.getElementById('p2-status').style.color = '#4caf50';
            document.getElementById('set-p2-btn').innerText = "Set P2";
        }
        draw();
        calMode = null;
        canvas.style.cursor = 'default';
        return;
    }

    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    // Store initial click globally for click vs drag detection
    clickStartX = e.clientX;
    clickStartY = e.clientY;

    canvas.style.cursor = 'grabbing';
}

function onMouseMove(e) {
    const mx = e.clientX;
    const my = e.clientY;

    if (calMode) return;

    if (isDragging) {
        const dx = mx - startX;
        const dy = my - startY;
        offsetX += dx;
        offsetY += dy;
        startX = mx;
        startY = my;
        draw();
    } else {
        // Hover detection
        let closest = null;
        let minDist = 10;
        const rad = calRotation * Math.PI / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        for (let s of stars) {
            const rx = s.x * cos - s.y * sin;
            const ry = s.x * sin + s.y * cos;
            const pos = worldToScreen(rx, ry);
            if (Math.abs(mx - pos.x) > minDist || Math.abs(my - pos.y) > minDist) continue;
            const dist = Math.hypot(mx - pos.x, my - pos.y);
            if (dist < minDist) { minDist = dist; closest = s; }
        }

        if (closest !== hoveredStar) {
            hoveredStar = closest;
            draw();
            // ONLY update info if NO star is selected
            if (!selectedStar) {
                updateInfo(closest);
            }
        }
    }
}

function onMouseUp(e) {
    // Ignore clicks on UI elements (panels, buttons) to prevent deselecting stars or interrupting interaction
    if (e.target.closest('#ui-layer') && e.target.id !== 'ui-layer') {
        isDragging = false;
        canvas.style.cursor = 'default';
        return;
    }

    // Also explicitly check for specific interactive areas if needed, but the above generic check should catch #star-info, #controls etc.
    // Note: #ui-layer has pointer-events:none, but children have auto.
    // So if e.target is #star-info or its children, the condition is true.

    if (isDragging) {
        const dist = Math.hypot(e.clientX - clickStartX, e.clientY - clickStartY);
        if (dist < 5) { // It's a click
            // Check for hit
            const mx = e.clientX;
            const my = e.clientY;
            let closest = null;
            let minDist = 10;
            const rad = calRotation * Math.PI / 180;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);

            for (let s of stars) {
                const rx = s.x * cos - s.y * sin;
                const ry = s.x * sin + s.y * cos;
                const pos = worldToScreen(rx, ry);
                if (Math.abs(mx - pos.x) > minDist || Math.abs(my - pos.y) > minDist) continue;
                const d = Math.hypot(mx - pos.x, my - pos.y);
                if (d < minDist) { minDist = d; closest = s; }
            }

            selectedStar = closest; // Set or Clear
            draw();
            updateInfo(selectedStar); // Force update to selection (or clear)
        }
    }

    isDragging = false;
    canvas.style.cursor = 'default';
}

function onWheel(e) {
    e.preventDefault();
    const zoomIntensity = 0.1;
    const delta = e.deltaY > 0 ? (1 - zoomIntensity) : (1 + zoomIntensity);
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const newScale = scale * delta;
    offsetX = mouseX - (mouseX - offsetX) * (newScale / scale);
    offsetY = mouseY - (mouseY - offsetY) * (newScale / scale);
    scale = newScale;
    draw();
}

function zoom(factor) {
    const cx = width / 2;
    const cy = height / 2;
    const newScale = scale * factor;
    offsetX = cx - (cx - offsetX) * (newScale / scale);
    offsetY = cy - (cy - offsetY) * (newScale / scale);
    scale = newScale;
    draw();
}

function updateInfo(star) {
    if (!star) {
        starInfoPanel.classList.add('hidden');
        canvas.style.cursor = isDragging ? 'grabbing' : 'default';
        return;
    }
    canvas.style.cursor = 'pointer';
    document.getElementById('star-id').textContent = star["통합번호"] || '-';
    starNameEl.textContent = star.Name || star["별자리"] || 'Unknown Star';
    starConstellationEl.textContent = star["별자리"] || '-';
    starMagEl.textContent = star.mag || '-';

    // Constellation Description
    if (constellationDescEl) {
        let desc = "";
        const constellationName = star["별자리"];
        if (constellationName) {
            // 1. Try exact match (or normalized)
            // Extract Hangul: "각(角)" -> "각", "좌각左角" -> "좌각"
            // The data in star_data.js often has "HangulHanja" like "좌각左角".
            // We need to extract just Hangul.
            const hangulName = constellationName.replace(/[^\uAC00-\uD7A3]/g, ''); // Extract only Hangul

            if (constellationMap[hangulName]) {
                desc = constellationMap[hangulName];
            } else {
                // 2. Fallback to "수" (Mansion)
                const mansion = star["수"];
                if (mansion && constellationMap[mansion]) {
                    desc = `[${mansion}수] ${constellationMap[mansion]}`;
                }
            }
        }
        // Sanitize: Split by newline, trim each line, join back
        if (desc) {
            desc = desc.split('\n').map(line => line.trim()).join('\n');
        }
        constellationDescEl.textContent = desc;
        constellationDescEl.style.display = desc ? 'block' : 'none';
    }

    starInfoPanel.classList.remove('hidden');
}

function animate() {
    requestAnimationFrame(animate);
}

loadData();
