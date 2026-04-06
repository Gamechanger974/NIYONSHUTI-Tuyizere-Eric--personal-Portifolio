// DOM Elements
const navbar = document.getElementById('navbar');
const navLinks = document.querySelector('.nav-links');
const hamburger = document.querySelector('.hamburger');
const scrollToTopBtn = document.getElementById('scrollToTop');
const sections = document.querySelectorAll('section');

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('mobile');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        navLinks.classList.remove('mobile');
        hamburger.classList.remove('active');
    }
});

// Sticky Navigation
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 15, 35, 0.98)';
        navbar.style.backdropFilter = 'blur(15px)';
    } else {
        navbar.style.background = 'rgba(15, 15, 35, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
});

// Active Section Highlighting
const observerOptions = {
    threshold: 0.3,
    rootMargin: '-50px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Scroll to Top Button
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Animate on Scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.skill-card, .project-card, .contact-form, .contact-info');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(element => {
        observer.observe(element);
    });
};

// Skill Bar Animation
const animateSkillBars = () => {
    const skillBars = document.querySelectorAll('.skill-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0%';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 200);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        observer.observe(bar);
    });
};

// Contact Form Handling
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Simple validation
    if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
    }

    // In a real application, you would send this data to a server
    // For now, we'll just show a success message
    alert(`Thank you for your message, ${name}! I'll get back to you soon.`);

    // Reset form
    contactForm.reset();
});

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
    animateSkillBars();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add loading animation to page
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Prevent right-click context menu (optional for portfolio)
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Add some interactive effects
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Typing effect for tagline (optional enhancement)
const typeWriter = (element, text, speed = 50) => {
    let i = 0;
    element.innerHTML = '';
    const timer = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
};

// Uncomment to add typing effect to tagline
// const tagline = document.querySelector('.tagline');
// window.addEventListener('load', () => {
//     typeWriter(tagline, tagline.textContent);
// });