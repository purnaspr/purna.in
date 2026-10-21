/* ==========================================================
   1. PRELOADER CONTROLLER: CLEAN, SILKY SMOOTH DISMISS
========================================================== */
function dismissPreloader() {
    const preloader = document.getElementById("intro-preloader");
    if (preloader && !preloader.classList.contains("fade-away")) {
        preloader.classList.add("fade-away");
        // ప్రీలోడర్ పూర్తిగా వెళ్ళిపోయిన తర్వాత మాత్రమే బ్యాక్‌గ్రౌండ్ గ్లోబ్ ప్రాసెసింగ్ స్టార్ట్ చేయాలి
        setTimeout(() => {
            if (window.deferredInitGlobe) {
                window.deferredInitGlobe();
            }
        }, 300);
    }
}

// 1.8 సెకన్లలో ఎటువంటి లాగ్ లేకుండా క్లీన్‌గా ఓపెన్ అవుతుంది
window.addEventListener("load", () => setTimeout(dismissPreloader, 1800));
setTimeout(dismissPreloader, 2600);

/* ==========================================================
   2. DOM READY EVENTS & CORE LOGIC
========================================================== */
document.addEventListener("DOMContentLoaded", () => {

    /* --- A. BACKGROUND MOVING STARS ANIMATION (DARK THEME ONLY) --- */
    const canvas = document.getElementById('starsCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const starsArray = [];
        const numberOfStars = 140;

        class Star {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2.2 + 0.8;
                this.speedY = Math.random() * 0.55 + 0.2;
                this.speedX = (Math.random() - 0.5) * 0.25;
                this.opacity = Math.random() * 0.8 + 0.2;
                this.fadeDirection = Math.random() > 0.5 ? 0.01 : -0.01;
            }
            draw() {
                const isDark = document.body.classList.contains('dark-theme');
                if (!isDark) return;

                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.shadowBlur = 8;
                ctx.shadowColor = "#38BDF8";

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
            update() {
                this.y -= this.speedY;
                this.x += this.speedX;
                this.opacity += this.fadeDirection;

                if (this.opacity > 0.95 || this.opacity < 0.2) {
                    this.fadeDirection = -this.fadeDirection;
                }
                if (this.y < 0) {
                    this.y = canvas.height;
                    this.x = Math.random() * canvas.width;
                }
                if (this.x < 0 || this.x > canvas.width) {
                    this.x = Math.random() * canvas.width;
                }
            }
        }

        for (let i = 0; i < numberOfStars; i++) {
            starsArray.push(new Star());
        }

        function animateStars() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (document.body.classList.contains('dark-theme')) {
                for (let i = 0; i < starsArray.length; i++) {
                    starsArray[i].update();
                    starsArray[i].draw();
                }
            }
            requestAnimationFrame(animateStars);
        }
        animateStars();
    }

    /* --- B. DARK / LIGHT THEME TOGGLE CONTROLLER --- */
    const themeToggleBtn = document.getElementById("theme-toggle");
    const savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        if (themeToggleBtn) themeToggleBtn.innerHTML = `<i class="fa-solid fa-sun"></i>`;
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark-theme");
            const isDark = document.body.classList.contains("dark-theme");

            if (isDark) {
                themeToggleBtn.innerHTML = `<i class="fa-solid fa-sun"></i>`;
                localStorage.setItem("portfolio-theme", "dark");
            } else {
                themeToggleBtn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
                localStorage.setItem("portfolio-theme", "light");
            }
        });
    }

    /* --- C. AUDIO PLAYER CONTROLLER --- */
    const playBtn = document.getElementById("play-intro-btn");
    const audio = document.getElementById("intro-audio");

    if (playBtn && audio) {
        playBtn.addEventListener("click", () => {
            if (audio.paused) {
                audio.play();
                playBtn.innerHTML = `<i class="fa-solid fa-circle-pause"></i> Pause Introduction`;
            } else {
                audio.pause();
                playBtn.innerHTML = `<i class="fa-solid fa-circle-play"></i> Watch Introduction`;
            }
        });

        audio.addEventListener("ended", () => {
            playBtn.innerHTML = `<i class="fa-solid fa-circle-play"></i> Watch Introduction`;
        });
    }

    /* --- D. FLOATING TERMINAL LOGIC --- */
    const toggleTermBtn = document.getElementById("toggle-term-btn");
    const closeTermBtn = document.getElementById("close-term-btn");
    const termPopup = document.getElementById("terminal-popup");
    const termInput = document.getElementById("terminal-input");
    const termOutput = document.getElementById("terminal-output");
    const termBody = document.getElementById("terminal-body");

    if (toggleTermBtn && termPopup) {
        toggleTermBtn.addEventListener("click", () => {
            termPopup.classList.toggle("open");
            if (termPopup.classList.contains("open") && termInput) {
                setTimeout(() => termInput.focus(), 200);
            }
        });

        if (closeTermBtn) {
            closeTermBtn.addEventListener("click", () => termPopup.classList.remove("open"));
        }
    }

    if (termInput && termOutput) {
        termInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const command = termInput.value.trim().toLowerCase();
                const cmdLine = document.createElement("div");
                cmdLine.className = "term-line";
                cmdLine.innerHTML = `<span class="term-green">purna@devops-node</span>:<span class="term-blue">~</span>$&nbsp;${termInput.value}`;
                termOutput.appendChild(cmdLine);

                let response = "";
                switch (command) {
                    case "help":
                        response = `<p class="term-line">Available Commands: <span class="term-yellow">about, skills, projects, future, contact, clear</span></p>`;
                        break;
                    case "about":
                        response = `<p class="term-line">Aspiring DevOps & Cloud Engineer specializing in AWS, IaC, CI/CD, and Containerization.</p>`;
                        break;
                    case "skills":
                        response = `<p class="term-line">🛠️ Tools: AWS, Docker, K8s, Jenkins, Terraform, Ansible, Linux, Git, GitHub, Maven, SonarQube, Python, JFrog</p>`;
                        break;
                    case "projects":
                        response = `<p class="term-line">🚀 <strong>1. Zero-Downtime Pipeline</strong> (AWS, KinD, Docker, SonarQube)<br>🚀 <strong>2. Java Web App Deployment</strong> (AWS, Jenkins, Docker, Tomcat)</p>`;
                        break;
                    case "future":
                        response = `<p class="term-line">📌 Cloud Native CI/CD, DevSecOps Security, AIOps Observability</p>`;
                        break;
                    case "contact":
                        response = `<p class="term-line">📧 Email: chandraraop698@gmail.com | 📞 Phone: +91 6302613398</p>`;
                        break;
                    case "clear":
                        termOutput.innerHTML = "";
                        termInput.value = "";
                        return;
                    default:
                        response = `<p class="term-line" style="color:#EF4444;">Command not found: '${command}'. Type <span class="term-yellow">'help'</span>.</p>`;
                }

                if (response) {
                    const resDiv = document.createElement("div");
                    resDiv.innerHTML = response;
                    termOutput.appendChild(resDiv);
                }

                termInput.value = "";
                if (termBody) termBody.scrollTop = termBody.scrollHeight;
            }
        });
    }

    /* --- E. GITHUB API REPO COUNT --- */
    const repoCountElement = document.getElementById("github-repo-count");
    if (repoCountElement) {
        fetch(`https://api.github.com/users/purnaspr`)
            .then(res => res.json())
            .then(data => {
                if (data.public_repos !== undefined) repoCountElement.innerText = `${data.public_repos}+`;
            })
            .catch(() => { repoCountElement.innerText = "16+"; });
    }

    /* --- F. SCROLLSPY & BACK TO TOP --- */
    const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
    if (navLinks.length) {
        const sections = Array.from(navLinks).map(l => document.querySelector(l.getAttribute("href"))).filter(Boolean);
        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(l => l.classList.remove("active"));
                    const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                    if (activeLink) activeLink.classList.add("active");
                }
            });
        }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
        sections.forEach(s => spyObserver.observe(s));
    }

    const backToTopBtn = document.getElementById("backToTopBtn");
    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            backToTopBtn.classList.toggle("visible", window.scrollY > 400);
        }, { passive: true });
        backToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    /* --- G. TYPING TEXT ANIMATION --- */
    const typingElement = document.getElementById("typing-text");
    if (typingElement) {
        const words = ["Aspiring DevOps & Cloud Engineer", "AWS & Infrastructure worker", "CI/CD Pipeline Automation builder"];
        let wIdx = 0, cIdx = 0, isDel = false;
        function type() {
            const current = words[wIdx];
            typingElement.textContent = isDel ? current.substring(0, cIdx - 1) : current.substring(0, cIdx + 1);
            cIdx = isDel ? cIdx - 1 : cIdx + 1;
            let speed = isDel ? 40 : 80;
            if (!isDel && cIdx === current.length) { speed = 2000; isDel = true; }
            else if (isDel && cIdx === 0) { isDel = false; wIdx = (wIdx + 1) % words.length; speed = 500; }
            setTimeout(type, speed);
        }
        type();
    }

    /* --- H. MOBILE HAMBURGER MENU --- */
    const hamburger = document.querySelector(".hamburger");
    const navLinksMenu = document.querySelector(".nav-links");
    if (hamburger && navLinksMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navLinksMenu.classList.toggle("active");
        });
        document.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navLinksMenu.classList.remove("active");
            });
        });
    }

    /* INITIALIZE INTERACTIVE COMPONENTS */
    initProjectSliderSafe();
    initInteractiveIDCard();
    initAcademicJourneyTabs();
});

/* ==========================================================
   3. INTERACTIVE 3D PHYSICS ID CARD TILT & DRAG LOGIC
========================================================== */
function initInteractiveIDCard() {
    const card = document.getElementById("idCard3D");
    const stage = document.getElementById("badgeStage");
    const glare = document.getElementById("cardGlare");

    if (!card || !stage) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;

    stage.addEventListener("mousemove", (e) => {
        if (isDragging) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -14;
        const rotateY = ((x - centerX) / centerX) * 14;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px)`;

        if (glare) {
            glare.style.opacity = "0.7";
            glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.45) 0%, transparent 65%)`;
        }
    });

    stage.addEventListener("mouseleave", () => {
        if (isDragging) return;
        card.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0px)";
        if (glare) glare.style.opacity = "0";
    });

    card.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX - currentX;
        startY = e.clientY - currentY;
        card.style.transition = "none";
    });

    window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        currentX = (e.clientX - startX) * 0.4;
        currentY = (e.clientY - startY) * 0.4;

        const rotZ = currentX * 0.08;
        card.style.transform = `translate(${currentX}px, ${currentY}px) rotateZ(${rotZ}deg)`;
    });

    window.addEventListener("mouseup", () => {
        if (!isDragging) return;
        isDragging = false;
        currentX = 0;
        currentY = 0;

        card.style.transition = "transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        card.style.transform = "translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)";
        if (glare) glare.style.opacity = "0";
    });

    stage.addEventListener("touchmove", (e) => {
        const touch = e.touches[0];
        const rect = card.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -10;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 10;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }, { passive: true });

    stage.addEventListener("touchend", () => {
        card.style.transition = "transform 0.5s ease";
        card.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
}

/* ==========================================================
   4. ACADEMIC JOURNEY: INTERACTIVE TWO-COLUMN SELECTION
========================================================== */
function initAcademicJourneyTabs() {
    const titles = document.querySelectorAll(".academic-level-title");
    const cards = document.querySelectorAll(".academic-detail-box");

    if (!titles.length || !cards.length) return;

    titles.forEach((title) => {
        title.addEventListener("click", () => {
            const step = title.getAttribute("data-step");

            titles.forEach(t => t.classList.remove("active"));
            cards.forEach(c => c.classList.remove("active"));

            title.classList.add("active");
            const targetCard = document.getElementById(`edu-card-${step}`);
            if (targetCard) {
                targetCard.classList.add("active");
            }
        });
    });
}

/* ==========================================================
   5. ZERO-DOWNTIME LIVE GITHUB SCREENSHOTS CONTROLLER
========================================================== */
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/purnaspr/project-1A-zero-downtime/main/";

const projectScreenshots = [
    { file: "0.png", desc: "Step 0: Spring Initializr Setup for Zero-Downtime Project" },
    { file: "1.png", desc: "Step 1: EC2 Environment Verification (Maven, Java 21, Git)" },
    { file: "2.png", desc: "Step 2: Docker Containerized Jenkins Setup on EC2" },
    { file: "3.png", desc: "Step 3: Jenkins Web Console Dashboard Initialized" },
    { file: "4.png", desc: "Step 4: Git Push & Local Docker Images Inspection" },
    { file: "5.png", desc: "Step 5: Jenkinsfile Declarative Pipeline Script Configuration" },
    { file: "6.png", desc: "Step 6: Multi-Stage Docker Container Build Running" },
    { file: "7.png", desc: "Step 7: Spring Boot Microservice Testing" },
    { file: "8.png", desc: "Step 8: Application Actuator Verification" },
    { file: "9.png", desc: "Step 9: Dockerfile Multi-stage Structure Verification" },
    { file: "10.png", desc: "Step 10: KinD Cluster Configuration YAML" },
    { file: "11.png", desc: "Step 11: Kubernetes NodePort Service Configuration" },
    { file: "12.png", desc: "Step 12: K8s RollingUpdate Deployment Strategy Manifest" },
    { file: "13.png", desc: "Step 13: Readiness, Liveness Probes & Resource Limits" },
    { file: "14.png", desc: "Step 14: GitHub Central Source Code Repository" },
    { file: "15.png", desc: "Step 15: Jenkins SCM Repository Integration" },
    { file: "16.png", desc: "Step 16: Jenkins Main Branch Specifier Trigger" },
    { file: "17.png", desc: "Step 17: CI Pipeline Successful Execution Dashboard" },
    { file: "18.png", desc: "Step 18: Jenkins Build Console Output: SUCCESS" },
    { file: "19.png", desc: "Step 19: SonarQube Code Quality Gate: PASSED" },
    { file: "20.png", desc: "Step 20: SonarQube Detailed Metrics Dashboard" },
    { file: "21.png", desc: "Step 21: Local KinD Multi-Node Cluster Creation" },
    { file: "22.png", desc: "Step 22: Kubernetes Production Namespace Configuration" },
    { file: "23.png", desc: "Step 23: Deployment Initialisation & Image Pull Check" },
    { file: "24.png", desc: "Step 24: Zero-Downtime Pods Transitioning to Running" },
    { file: "25.png", desc: "Step 25: NodePort Routing & KinD Cluster Image Loading" },
    { file: "26.png", desc: "Step 26: Curl Verification: 100% Zero-Downtime Running" },
    { file: "27.png", desc: "Step 27: Production Live Actuator Endpoint HTTP 200 OK" }
];

let currentProjIndex = 0;

function getImageUrl(index) {
    return GITHUB_RAW_BASE + projectScreenshots[index].file;
}

function updateSliderDisplay() {
    const track = document.getElementById("projectTrack");
    const counter = document.getElementById("galleryCounter");

    if (!track) return;

    track.innerHTML = `
        <img src="${getImageUrl(currentProjIndex)}" 
             alt="${projectScreenshots[currentProjIndex].desc}" 
             class="demo-slide-img" 
             onclick="openProjectModal(${currentProjIndex})"
             onerror="this.onerror=null; this.src='${projectScreenshots[currentProjIndex].file}';" />
    `;

    if (counter) {
        counter.innerText = `${currentProjIndex + 1} / ${projectScreenshots.length}`;
    }
}

function initProjectSliderSafe() {
    updateSliderDisplay();

    const prevBtn = document.getElementById("projPrevBtn");
    const nextBtn = document.getElementById("projNextBtn");

    if (prevBtn) {
        prevBtn.onclick = function(e) {
            e.preventDefault();
            currentProjIndex = (currentProjIndex - 1 + projectScreenshots.length) % projectScreenshots.length;
            updateSliderDisplay();
        };
    }

    if (nextBtn) {
        nextBtn.onclick = function(e) {
            e.preventDefault();
            currentProjIndex = (currentProjIndex + 1) % projectScreenshots.length;
            updateSliderDisplay();
        };
    }
}

function openProjectModal(index) {
    if (index !== undefined) currentProjIndex = index;
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    const caption = document.getElementById("modalCaption");

    if (modal && modalImg) {
        modalImg.src = getImageUrl(currentProjIndex);
        modalImg.onerror = function() {
            this.src = projectScreenshots[currentProjIndex].file;
        };
        if (caption) {
            caption.innerText = `[${currentProjIndex + 1}/28] ${projectScreenshots[currentProjIndex].desc}`;
        }
        modal.classList.add("open");
    }
}

function closeProjectModal() {
    const modal = document.getElementById("imageModal");
    if (modal) modal.classList.remove("open");
}

function nextModalSlide() {
    currentProjIndex = (currentProjIndex + 1) % projectScreenshots.length;
    updateSliderDisplay();
    openProjectModal(currentProjIndex);
}

function prevModalSlide() {
    currentProjIndex = (currentProjIndex - 1 + projectScreenshots.length) % projectScreenshots.length;
    updateSliderDisplay();
    openProjectModal(currentProjIndex);
}

window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.nextModalSlide = nextModalSlide;
window.prevModalSlide = prevModalSlide;

/* ==========================================================
   6. VANILLA D3.JS WIREFRAME DOTTED GLOBE (DEFERRED & OPTIMIZED)
========================================================== */
window.deferredInitGlobe = function() {
    const canvas = document.getElementById("globeCanvas");
    if (!canvas || typeof d3 === "undefined") return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const size = Math.min(440, window.innerWidth - 60);
    const radius = size / 2.3;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    context.scale(dpr, dpr);

    const projection = d3.geoOrthographic()
        .scale(radius)
        .translate([size / 2, size / 2])
        .clipAngle(90);

    const path = d3.geoPath().projection(projection).context(context);

    function pointInPolygon(point, polygon) {
        const [x, y] = point;
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const [xi, yi] = polygon[i];
            const [xj, yj] = polygon[j];
            if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
                inside = !inside;
            }
        }
        return inside;
    }

    function pointInFeature(point, feature) {
        const geom = feature.geometry;
        if (geom.type === "Polygon") {
            if (!pointInPolygon(point, geom.coordinates[0])) return false;
            for (let i = 1; i < geom.coordinates.length; i++) {
                if (pointInPolygon(point, geom.coordinates[i])) return false;
            }
            return true;
        } else if (geom.type === "MultiPolygon") {
            for (const poly of geom.coordinates) {
                if (pointInPolygon(point, poly[0])) {
                    let inHole = false;
                    for (let i = 1; i < poly.length; i++) {
                        if (pointInPolygon(point, poly[i])) { inHole = true; break; }
                    }
                    if (!inHole) return true;
                }
            }
        }
        return false;
    }

    function generateDots(feature, spacing = 20) {
        const dots = [];
        const [[minLng, minLat], [maxLng, maxLat]] = d3.geoBounds(feature);
        const step = spacing * 0.1;
        for (let lng = minLng; lng <= maxLng; lng += step) {
            for (let lat = minLat; lat <= maxLat; lat += step) {
                const pt = [lng, lat];
                if (pointInFeature(pt, feature)) dots.push(pt);
            }
        }
        return dots;
    }

    const allDots = [];
    let landData = null;

    function render() {
        context.clearRect(0, 0, size, size);
        const currentScale = projection.scale();
        const scaleFactor = currentScale / radius;

        context.beginPath();
        context.arc(size / 2, size / 2, currentScale, 0, 2 * Math.PI);
        context.fillStyle = "#030712";
        context.fill();
        context.strokeStyle = "rgba(56, 189, 248, 0.45)";
        context.lineWidth = 1.5 * scaleFactor;
        context.stroke();

        if (landData) {
            const graticule = d3.geoGraticule();
            context.beginPath();
            path(graticule());
            context.strokeStyle = "rgba(56, 189, 248, 0.18)";
            context.lineWidth = 0.8 * scaleFactor;
            context.stroke();

            context.beginPath();
            landData.features.forEach(f => path(f));
            context.strokeStyle = "rgba(14, 165, 233, 0.75)";
            context.lineWidth = 1 * scaleFactor;
            context.stroke();

            allDots.forEach(dot => {
                const projected = projection([dot.lng, dot.lat]);
                if (projected && projected[0] >= 0 && projected[0] <= size && projected[1] >= 0 && projected[1] <= size) {
                    context.beginPath();
                    context.arc(projected[0], projected[1], 1.2 * scaleFactor, 0, 2 * Math.PI);
                    context.fillStyle = "#38bdf8";
                    context.fill();
                }
            });
        }
    }

    const rotation = [0, -15];
    let autoRotate = true;
    const rotationSpeed = 0.4;

    d3.timer(() => {
        if (autoRotate) {
            rotation[0] += rotationSpeed;
            projection.rotate(rotation);
            render();
        }
    });

    canvas.addEventListener("mousedown", (e) => {
        autoRotate = false;
        const startX = e.clientX;
        const startY = e.clientY;
        const startRot = [...rotation];

        const onMove = (me) => {
            const dx = me.clientX - startX;
            const dy = me.clientY - startY;
            rotation[0] = startRot[0] + dx * 0.4;
            rotation[1] = Math.max(-90, Math.min(90, startRot[1] - dy * 0.4));
            projection.rotate(rotation);
            render();
        };

        const onUp = () => {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
            setTimeout(() => { autoRotate = true; }, 40);
        };

        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
    });

    canvas.addEventListener("wheel", (e) => {
        e.preventDefault();
        const factor = e.deltaY > 0 ? 0.92 : 1.08;
        projection.scale(Math.max(radius * 0.6, Math.min(radius * 2.5, projection.scale() * factor)));
        render();
    }, { passive: false });

    fetch("https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json")
        .then(res => res.json())
        .then(data => {
            landData = data;
            landData.features.forEach(feature => {
                const dots = generateDots(feature, 20);
                dots.forEach(([lng, lat]) => allDots.push({ lng, lat }));
            });
            render();
        })
        .catch(err => console.error("Error loading globe map:", err));
};

/* ==========================================================
   PROJECT ACCORDION TOGGLE CONTROLLER
========================================================== */
function toggleProjectAccordion(itemId) {
    const item = document.getElementById(itemId);
    if (!item) return;

    const isActive = item.classList.contains("active");

    // ఒకవేళ ఒకే సమయంలో ఒకటే ఓపెన్ అయి ఉండాలి అనుకుంటే క్రింది 2 లైన్లు ఉంచండి (optional)
    // document.querySelectorAll(".project-accordion-item").forEach(el => el.classList.remove("active"));

    if (isActive) {
        item.classList.remove("active");
    } else {
        item.classList.add("active");
        
        // మొదటి ప్రాజెక్ట్ ఓపెన్ అయినప్పుడు స్లైడర్ సరిగ్గా రెండర్ అవ్వడానికి
        if (itemId === "proj-item-1" && typeof initProjectSliderSafe === "function") {
            setTimeout(initProjectSliderSafe, 100);
        }
    }
}

window.toggleProjectAccordion = toggleProjectAccordion;
