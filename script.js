document.addEventListener('DOMContentLoaded', function () {
    const contentEl = document.getElementById('content');
    const filterTags = document.querySelectorAll('.filter-tag');

    let allPosts = [];
    let currentFilter = 'all';

    fetch('posts.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load posts.json');
            return response.json();
        })
        .then(data => {
            allPosts = data;
            renderPosts(currentFilter);
        })
        .catch(err => {
            contentEl.innerHTML = '<p class="no-results">Failed to load posts. Please check posts.json.</p>';
            console.error(err);
        });

    function renderPosts(filterTag) {
        // Filter the array
        const visible = (filterTag === 'all')
            ? allPosts
            : allPosts.filter(post => post.tags.includes(filterTag));

        if (visible.length === 0) {
            contentEl.innerHTML = '<p class="no-results">No posts with this tag yet.</p>';
            return;
        }

        contentEl.innerHTML = visible.map(post => {
            const tagsHtml = post.tags.map(tag =>
                `<span class="tag" data-tag="${tag}">#${tag}</span>`
            ).join('');

            return `
                <article class="post" data-tags="${post.tags.join(' ')}">
                    <h2>${escapeHtml(post.title)}</h2>
                    <div class="post-date">${formatDate(post.date)}</div>
                    <div class="post-body">${escapeHtml(post.body)}</div>
                    <div class="post-tags">${tagsHtml}</div>
                </article>
            `;
        }).join('');

        contentEl.querySelectorAll('.post-tags .tag').forEach(tagEl => {
            tagEl.addEventListener('click', function () {
                const tag = this.getAttribute('data-tag');
                applyFilter(tag);
            });
        });
    }

    function applyFilter(tag) {
        currentFilter = tag;

        filterTags.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tag') === tag);
        });

        renderPosts(tag);
    }

    filterTags.forEach(btn => {
        btn.addEventListener('click', function () {
            applyFilter(this.getAttribute('data-tag'));
        });
    });

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d)) return dateStr;
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
});