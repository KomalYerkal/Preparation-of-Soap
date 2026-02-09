// Main JavaScript for Liquid Soap Preparation Website

document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP
    gsap.registerPlugin(ScrollTrigger);

    // --- Navigation & Mobile Menu ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- Dark/Light Mode Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            htmlElement.classList.toggle('dark');
            // Save preference
            if (htmlElement.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });

        // Load preference
        if (localStorage.getItem('theme') === 'dark') {
            htmlElement.classList.add('dark');
        }
    }

    // --- Hero Animations ---
    gsap.from("#hero-text", {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: "power3.out",
        delay: 0.2
    });

    gsap.from("#hero-image", {
        duration: 1,
        x: 50,
        opacity: 0,
        ease: "power3.out",
        delay: 0.5
    });

    // --- Animated Counter for Steps/Stats ---
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const updateCount = () => {
            const count = +counter.innerText;
            const inc = target / 200; // Speed

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target;
            }
        };
        // Trigger on scroll using Intersection Observer or GSAP
        ScrollTrigger.create({
            trigger: counter,
            start: "top 80%",
            onEnter: () => updateCount()
        });
    });

    // --- Bubble Generation for Hero Background ---
    const heroSection = document.getElementById('home');
    if (heroSection) {
        const createBubble = () => {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            const size = Math.random() * 60;
            bubble.style.width = 20 + size + 'px';
            bubble.style.height = 20 + size + 'px';
            bubble.style.left = Math.random() * 100 + '%';
            bubble.style.animationDuration = (Math.random() * 5 + 5) + 's'; // 5-10s
            heroSection.appendChild(bubble);

            setTimeout(() => {
                bubble.remove();
            }, 10000);
        };
        setInterval(createBubble, 1000); // Create a bubble every second
    }

    // --- Section Animations on Scroll ---
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // --- Recipe Calculator Logic ---
    const oilInput = document.getElementById('oil-weight');
    const superfatInput = document.getElementById('superfat');
    const superfatVal = document.getElementById('superfat-val');
    const waterNeeded = document.getElementById('water-needed');
    const lyeNeeded = document.getElementById('lye-needed');

    if (oilInput && superfatInput) {
        const calculate = () => {
            const oil = parseFloat(oilInput.value) || 0;
            const superfat = parseInt(superfatInput.value) || 0;

            // Constants for calculation (Average SAP values)
            // SAP for NaOH is approx 0.137 for Olive/Coconut blend avg
            const sapValue = 0.137;

            // Water calculation (typically 38% of oil weight, or water:lye ratio)
            // Here using 38% of oil weight as a standard beginner safe zone
            const water = oil * 0.38;

            // Lye calculation
            // Lye = (Oil Weight * SAP) * (1 - Superfat%)
            const lye = (oil * sapValue) * (1 - (superfat / 100));

            superfatVal.innerText = superfat + '%';
            waterNeeded.innerText = water.toFixed(1) + 'g';
            lyeNeeded.innerText = lye.toFixed(1) + 'g';
        };

        oilInput.addEventListener('input', calculate);
        superfatInput.addEventListener('input', calculate);
    }

    // --- Safety Quiz Logic ---
    let currentQuestionIndex = 1;
    const totalQuestions = 3;

    window.checkAnswer = (btn, isCorrect) => {
        const currentQuestion = document.querySelector(`.quiz-question[data-question="${currentQuestionIndex}"]`);
        const feedback = currentQuestion.querySelector('.quiz-feedback');
        const allBtns = currentQuestion.querySelectorAll('.quiz-btn');

        // Reset styles for current question only
        allBtns.forEach(b => {
            b.classList.remove('bg-green-100', 'bg-red-100', 'border-green-500', 'border-red-500', 'text-green-700', 'text-red-700');
        });

        if (isCorrect) {
            btn.classList.add('bg-green-100', 'border-green-500', 'text-green-700');
            feedback.innerHTML = '<i class="fa-solid fa-check-circle text-green-500 mr-2"></i> Correct!';
            feedback.classList.remove('hidden', 'text-red-600');
            feedback.classList.add('text-green-600');
        } else {
            btn.classList.add('bg-red-100', 'border-red-500', 'text-red-700');
            feedback.innerHTML = '<i class="fa-solid fa-triangle-exclamation text-red-500 mr-2"></i> Incorrect. Try again!';
            feedback.classList.remove('hidden', 'text-green-600');
            feedback.classList.add('text-red-600');
        }
        feedback.classList.remove('hidden');
    };

    window.nextQuestion = () => {
        if (currentQuestionIndex < totalQuestions) {
            // Hide current question
            document.querySelector(`.quiz-question[data-question="${currentQuestionIndex}"]`).classList.add('hidden');
            document.querySelector(`.quiz-question[data-question="${currentQuestionIndex}"]`).classList.remove('active');

            // Show next question
            currentQuestionIndex++;
            document.querySelector(`.quiz-question[data-question="${currentQuestionIndex}"]`).classList.remove('hidden');
            document.querySelector(`.quiz-question[data-question="${currentQuestionIndex}"]`).classList.add('active');

            // Update counter
            document.getElementById('current-question').innerText = currentQuestionIndex;

            // Update button states
            document.getElementById('prev-btn').disabled = false;
            if (currentQuestionIndex === totalQuestions) {
                document.getElementById('next-btn').disabled = true;
                document.getElementById('next-btn').classList.add('opacity-50', 'cursor-not-allowed');
            }
        }
    };

    window.previousQuestion = () => {
        if (currentQuestionIndex > 1) {
            // Hide current question
            document.querySelector(`.quiz-question[data-question="${currentQuestionIndex}"]`).classList.add('hidden');
            document.querySelector(`.quiz-question[data-question="${currentQuestionIndex}"]`).classList.remove('active');

            // Show previous question
            currentQuestionIndex--;
            document.querySelector(`.quiz-question[data-question="${currentQuestionIndex}"]`).classList.remove('hidden');
            document.querySelector(`.quiz-question[data-question="${currentQuestionIndex}"]`).classList.add('active');

            // Update counter
            document.getElementById('current-question').innerText = currentQuestionIndex;

            // Update button states
            document.getElementById('next-btn').disabled = false;
            document.getElementById('next-btn').classList.remove('opacity-50', 'cursor-not-allowed');
            if (currentQuestionIndex === 1) {
                document.getElementById('prev-btn').disabled = true;
            }
        }
    };

    // --- Virtual Lab (Drag & Drop) Logic ---
    const draggables = document.querySelectorAll('.draggable');
    const beaker = document.getElementById('mixing-beaker');
    const mixture = document.getElementById('mixture');
    const statusText = document.getElementById('lab-status');
    const reactionText = document.getElementById('reaction-text');
    const resetBtn = document.getElementById('reset-lab');

    let ingredientsAdded = new Set();

    if (beaker) {
        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', () => {
                draggable.classList.add('opacity-50');
            });

            draggable.addEventListener('dragend', () => {
                draggable.classList.remove('opacity-50');
            });
        });

        beaker.addEventListener('dragover', e => {
            e.preventDefault();
        });

        beaker.addEventListener('drop', e => {
            e.preventDefault();
            const draggedType = document.querySelector('.draggable.opacity-50').getAttribute('data-type');

            if (!ingredientsAdded.has(draggedType)) {
                addIngredient(draggedType);
            }
        });

        resetBtn.addEventListener('click', () => {
            ingredientsAdded.clear();
            updateMixtureState();
        });
    }

    function addIngredient(type) {
        ingredientsAdded.add(type);
        updateMixtureState();
    }

    function updateMixtureState() {
        // Simple state machine
        const hasWater = ingredientsAdded.has('water');
        const hasOil = ingredientsAdded.has('oil');
        const hasLye = ingredientsAdded.has('lye');

        let height = 0;
        let color = 'bg-soap-200';
        let status = 'Empty';
        let text = '';
        reactionText.classList.add('hidden');

        if (ingredientsAdded.size === 0) {
            height = 0;
        } else if (ingredientsAdded.size === 1) {
            height = 30;
            status = 'Filling...';
            if (hasOil) color = 'bg-yellow-200';
        } else if (ingredientsAdded.size === 2) {
            height = 60;
            status = 'Mixing...';
            if (hasOil && hasWater) {
                status = 'Oil & Water (Separated)';
                color = 'bg-gradient-to-t from-blue-200 to-yellow-200';
            }
        } else if (ingredientsAdded.size === 3) {
            height = 90;
            status = 'Saponification!';
            color = 'bg-green-200';
            reactionText.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Reaction Started!';
            reactionText.classList.remove('hidden');

            setTimeout(() => {
                reactionText.innerHTML = '<i class="fa-solid fa-check mr-1"></i> Soap Created!';
                statusText.innerText = 'Success!';
                statusText.classList.remove('bg-gray-200', 'text-gray-600');
                statusText.classList.add('bg-green-100', 'text-green-700');
            }, 3000);
        }

        mixture.style.height = height + '%';
        mixture.className = `w-full transition-all duration-1000 flex items-center justify-center ${color}`;
        statusText.innerText = status;

        if (ingredientsAdded.size < 3) {
            statusText.classList.add('bg-gray-200', 'text-gray-600');
            statusText.classList.remove('bg-green-100', 'text-green-700');
        }
    }
});
