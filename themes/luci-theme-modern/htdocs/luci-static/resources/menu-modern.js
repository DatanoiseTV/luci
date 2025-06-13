/**
 * Modern Theme Menu JavaScript
 * Copyright 2025 OpenWrt.org
 */

(function() {
	'use strict';

	let menu = {};

	function init() {
		if (typeof L !== 'undefined' && L.ui) {
			menu = L.ui.menu;
		}
	}

	function renderMainMenu(tree) {
		const menubar = document.getElementById('menubar');
		const mainmenu = document.getElementById('mainmenu');
		
		if (!menubar || !mainmenu) return;

		// Clear existing menus
		menubar.innerHTML = '';
		mainmenu.innerHTML = '';

		// Render top-level navigation
		renderTopNav(tree, menubar);
		
		// Render sidebar menu
		renderSidebarMenu(tree, mainmenu);
	}

	function renderTopNav(tree, container) {
		if (!tree || !tree.children) return;

		const ul = document.createElement('ul');
		ul.className = 'nav-menu';

		for (const [key, node] of Object.entries(tree.children)) {
			if (!node.title || node.hidden) continue;

			const li = document.createElement('li');
			li.className = 'nav-item';

			const a = document.createElement('a');
			a.className = 'nav-link';
			a.href = node.url || '#';
			a.textContent = L._(node.title);
			
			// Add active class if current page
			if (isActive(node)) {
				a.classList.add('active');
			}

			// Add hover effect
			a.addEventListener('mouseenter', function() {
				this.style.transform = 'translateY(-2px)';
			});
			
			a.addEventListener('mouseleave', function() {
				this.style.transform = 'translateY(0)';
			});

			li.appendChild(a);
			ul.appendChild(li);
		}

		container.appendChild(ul);
	}

	function renderSidebarMenu(tree, container) {
		if (!tree || !tree.children) return;

		for (const [key, node] of Object.entries(tree.children)) {
			if (!node.title || node.hidden) continue;

			const section = document.createElement('div');
			section.className = 'menu-section';

			const title = document.createElement('div');
			title.className = 'menu-title';
			title.textContent = L._(node.title);
			section.appendChild(title);

			if (node.children) {
				const ul = document.createElement('ul');
				ul.className = 'menu-list';

				renderMenuItems(node.children, ul, 0);
				section.appendChild(ul);
			}

			container.appendChild(section);
		}
	}

	function renderMenuItems(children, container, depth) {
		for (const [key, node] of Object.entries(children)) {
			if (!node.title || node.hidden) continue;

			const li = document.createElement('li');
			li.className = 'menu-item';

			const a = document.createElement('a');
			a.className = 'menu-link';
			a.href = node.url || '#';
			a.style.paddingLeft = `${0.75 + (depth * 0.5)}rem`;

			// Add icon if available
			if (node.icon) {
				const icon = document.createElement('span');
				icon.className = 'menu-icon';
				icon.textContent = node.icon;
				a.appendChild(icon);
			}

			const text = document.createElement('span');
			text.textContent = L._(node.title);
			a.appendChild(text);

			// Add active class if current page
			if (isActive(node)) {
				a.classList.add('active');
			}

			// Add smooth animations
			a.addEventListener('mouseenter', function() {
				this.style.paddingLeft = `${0.75 + (depth * 0.5) + 0.25}rem`;
			});
			
			a.addEventListener('mouseleave', function() {
				this.style.paddingLeft = `${0.75 + (depth * 0.5)}rem`;
			});

			li.appendChild(a);
			container.appendChild(li);

			// Recursively render children
			if (node.children) {
				const subUl = document.createElement('ul');
				subUl.className = 'menu-list submenu';
				renderMenuItems(node.children, subUl, depth + 1);
				li.appendChild(subUl);
			}
		}
	}

	function isActive(node) {
		if (!node.url) return false;
		
		const currentPath = window.location.pathname;
		const nodePath = node.url.replace(/^.*?\/cgi-bin\/luci/, '');
		
		return currentPath.endsWith(nodePath) || currentPath.includes(nodePath);
	}

	// Progress bar for page loading
	function showProgressBar() {
		let progressBar = document.getElementById('loading-progress');
		
		if (!progressBar) {
			progressBar = document.createElement('div');
			progressBar.id = 'loading-progress';
			progressBar.innerHTML = '<div class="progress-bar"></div>';
			progressBar.style.cssText = `
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 3px;
				background-color: var(--bg-tertiary);
				z-index: 9999;
				opacity: 0;
				transition: opacity 0.3s ease;
			`;
			
			const bar = progressBar.querySelector('.progress-bar');
			bar.style.cssText = `
				height: 100%;
				width: 0%;
				background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
				transition: width 0.3s ease;
			`;
			
			document.body.appendChild(progressBar);
		}
		
		progressBar.style.opacity = '1';
		const bar = progressBar.querySelector('.progress-bar');
		
		// Animate progress
		let progress = 0;
		const interval = setInterval(() => {
			progress += Math.random() * 15;
			if (progress > 90) progress = 90;
			bar.style.width = progress + '%';
		}, 100);
		
		return function complete() {
			clearInterval(interval);
			bar.style.width = '100%';
			setTimeout(() => {
				progressBar.style.opacity = '0';
				setTimeout(() => {
					if (progressBar.parentNode) {
						progressBar.parentNode.removeChild(progressBar);
					}
				}, 300);
			}, 200);
		};
	}

	// Enhanced form interactions
	function enhanceFormElements() {
		// Add floating label effect to form inputs
		const formGroups = document.querySelectorAll('.form-group');
		formGroups.forEach(group => {
			const input = group.querySelector('input, select, textarea');
			const label = group.querySelector('label');
			
			if (input && label) {
				input.addEventListener('focus', () => {
					group.classList.add('focused');
				});
				
				input.addEventListener('blur', () => {
					if (!input.value.trim()) {
						group.classList.remove('focused');
					}
				});
				
				// Check initial state
				if (input.value.trim()) {
					group.classList.add('focused');
				}
			}
		});

		// Enhanced button interactions
		const buttons = document.querySelectorAll('.btn');
		buttons.forEach(button => {
			button.addEventListener('click', function(e) {
				// Create ripple effect
				const ripple = document.createElement('span');
				const rect = button.getBoundingClientRect();
				const size = Math.max(rect.width, rect.height);
				const x = e.clientX - rect.left - size / 2;
				const y = e.clientY - rect.top - size / 2;
				
				ripple.style.cssText = `
					position: absolute;
					width: ${size}px;
					height: ${size}px;
					left: ${x}px;
					top: ${y}px;
					background: rgba(255, 255, 255, 0.3);
					border-radius: 50%;
					transform: scale(0);
					animation: ripple-animation 0.6s linear;
					pointer-events: none;
				`;
				
				button.appendChild(ripple);
				
				setTimeout(() => {
					if (ripple.parentNode) {
						ripple.parentNode.removeChild(ripple);
					}
				}, 600);
			});
		});
	}

	// Smooth scrolling for internal links
	function enableSmoothScrolling() {
		const links = document.querySelectorAll('a[href^="#"]');
		links.forEach(link => {
			link.addEventListener('click', function(e) {
				e.preventDefault();
				const target = document.querySelector(this.getAttribute('href'));
				if (target) {
					target.scrollIntoView({
						behavior: 'smooth',
						block: 'start'
					});
				}
			});
		});
	}

	// Notification system
	function showNotification(message, type = 'info', duration = 5000) {
		const notification = document.createElement('div');
		notification.className = `notification notification-${type}`;
		notification.innerHTML = `
			<div class="notification-content">
				<span class="notification-icon">${getNotificationIcon(type)}</span>
				<span class="notification-message">${message}</span>
				<button class="notification-close">&times;</button>
			</div>
		`;
		
		notification.style.cssText = `
			position: fixed;
			top: 20px;
			right: 20px;
			background: var(--bg-card);
			border: 1px solid var(--border-primary);
			border-radius: var(--border-radius);
			box-shadow: var(--shadow-lg);
			padding: 1rem;
			z-index: 10000;
			max-width: 400px;
			transform: translateX(100%);
			transition: transform 0.3s ease;
		`;
		
		document.body.appendChild(notification);
		
		// Animate in
		setTimeout(() => {
			notification.style.transform = 'translateX(0)';
		}, 10);
		
		// Auto remove
		const removeNotification = () => {
			notification.style.transform = 'translateX(100%)';
			setTimeout(() => {
				if (notification.parentNode) {
					notification.parentNode.removeChild(notification);
				}
			}, 300);
		};
		
		// Close button
		notification.querySelector('.notification-close').addEventListener('click', removeNotification);
		
		// Auto dismiss
		if (duration > 0) {
			setTimeout(removeNotification, duration);
		}
	}

	function getNotificationIcon(type) {
		const icons = {
			info: 'ℹ️',
			success: '✅',
			warning: '⚠️',
			error: '❌'
		};
		return icons[type] || icons.info;
	}

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

	// Page transition effects
	let pageTransition = null;

	function handlePageTransition() {
		// Show loading on navigation
		const links = document.querySelectorAll('a:not([href^="#"]):not([target="_blank"])');
		links.forEach(link => {
			link.addEventListener('click', function(e) {
				if (this.hostname === window.location.hostname) {
					pageTransition = showProgressBar();
				}
			});
		});

		// Complete loading when page loads
		window.addEventListener('load', function() {
			if (pageTransition) {
				pageTransition();
				pageTransition = null;
			}
		});
	}

	// Initialize enhancements
	document.addEventListener('DOMContentLoaded', function() {
		enhanceFormElements();
		enableSmoothScrolling();
		handlePageTransition();
	});

	// Export functions for global use
	window.ModernTheme = {
		renderMainMenu,
		showNotification,
		showProgressBar
	};

	// Add CSS for animations
	const style = document.createElement('style');
	style.textContent = `
		@keyframes ripple-animation {
			to {
				transform: scale(4);
				opacity: 0;
			}
		}

		.form-group.focused label {
			transform: translateY(-0.5rem);
			font-size: 0.75rem;
			color: var(--primary);
		}

		.notification {
			animation: slideInRight 0.3s ease;
		}

		@keyframes slideInRight {
			from {
				transform: translateX(100%);
				opacity: 0;
			}
			to {
				transform: translateX(0);
				opacity: 1;
			}
		}

		.notification-content {
			display: flex;
			align-items: center;
			gap: 0.75rem;
		}

		.notification-close {
			background: none;
			border: none;
			font-size: 1.25rem;
			cursor: pointer;
			color: var(--text-muted);
			margin-left: auto;
		}

		.notification-close:hover {
			color: var(--text-primary);
		}

		.submenu {
			max-height: 0;
			overflow: hidden;
			transition: max-height 0.3s ease;
		}

		.menu-item:hover .submenu {
			max-height: 500px;
		}

		.menu-link {
			transition: all 0.2s ease;
		}

		.page-loading {
			opacity: 0.8;
			pointer-events: none;
		}
	`;
	document.head.appendChild(style);

})();