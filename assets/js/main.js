document.addEventListener('DOMContentLoaded', () => {
    function debounce(fn, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    const searchInput = document.getElementById('search-input');
    const articleNodes = document.querySelectorAll('.compact-article');

    if (searchInput && articleNodes.length) {
        const handleSearch = (e) => {
            const query = e.target.value.toLowerCase();

            articleNodes.forEach(article => {
                const title = article.querySelector('.compact-title')?.textContent.toLowerCase() || '';
                const isVisible = title.includes(query);
                article.style.display = isVisible ? 'flex' : 'none';

                const group = article.closest('.year-group');
                if (group) {
                    const visibleArticles = group.querySelectorAll('.compact-article[style*="flex"]');
                    group.style.display = visibleArticles.length ? 'block' : 'none';
                }
            });
        };

        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href')?.slice(1);
            const target = document.getElementById(targetId);

            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    const codeBlocks = document.querySelectorAll('pre code');

    if (codeBlocks.length) {
        if (!document.querySelector('style[data-copy-button]')) {
            const style = document.createElement('style');
            style.setAttribute('data-copy-button', '');
            style.textContent = `
        .copy-button {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background-color: #333;
          color: #e5e5e5;
          border: 1px solid #555;
          border-radius: 4px;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s ease;
          z-index: 1;
        }
        .copy-button:hover {
          background-color: #00ff00;
          color: #0d0d0d;
        }
        pre {
          position: relative;
        }
        pre:hover .copy-button {
          opacity: 1;
        }
      `;
            document.head.appendChild(style);
        }

        codeBlocks.forEach(block => {
            const pre = block.parentElement;
            const button = document.createElement('button');
            button.className = 'copy-button';
            button.textContent = 'Copy';
            button.setAttribute('aria-label', 'Copy code to clipboard');
            pre.appendChild(button);

            button.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(block.textContent);
                    button.textContent = 'Copied!';
                } catch {
                    button.textContent = 'Failed';
                }

                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            });
        });
    }
});
