const username = 'samerkanjo.bsky.social'; // Replace with your actual Bluesky handle
const apiUrl = `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${username}`;

async function fetchPosts() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data); // Log the response data to inspect its structure
    displayPosts(data.feed);
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

function displayPosts(posts) {
  const postsContainer = document.getElementById('posts');
  postsContainer.innerHTML = ''; // Clear any existing content

  const last10Posts = posts.slice(0, 10); // Get the last 10 posts

  last10Posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.className = 'post';

    const postHeader = document.createElement('div');
    postHeader.className = 'post-header';

    const avatar = document.createElement('img');
    avatar.src = post.post.author.avatar || 'default-avatar.png'; // Use a default avatar if none is provided
    avatar.alt = `${post.post.author.displayName}'s avatar`;

    const username = document.createElement('span');
    username.className = 'username';
    username.textContent = post.post.author.displayName || post.post.author.handle;

    postHeader.appendChild(avatar);
    postHeader.appendChild(username);

    const postBody = document.createElement('div');
    postBody.className = 'post-body';
    postBody.textContent = post.post.record.text || 'No content available';

    // Check for embedded images and add them if present
    if (post.post.record.embed && post.post.record.embed.images && post.post.record.embed.images.length > 0) {
      const mediaContainer = document.createElement('div');
      mediaContainer.className = 'media-container';

      post.post.record.embed.images.forEach(image => {
        const img = document.createElement('img');
        img.src = `https://cdn.bsky.app/img/feed_fullsize/plain/${post.post.author.did}/${image.image.ref.$link}@jpeg`;
        img.alt = image.alt || 'Post image';
        img.className = 'post-image';
        mediaContainer.appendChild(img);
      });

      postBody.appendChild(mediaContainer);
    }

    const postLink = document.createElement('a');
    postLink.href = `https://bsky.app/profile/${post.post.author.handle}/post/${post.post.uri.split('/').pop()}`;
    postLink.textContent = 'View on Bluesky';
    postLink.target = '_blank'; // Open link in a new tab
    postLink.className = 'post-link';

    postElement.appendChild(postHeader);
    postElement.appendChild(postBody);
    postElement.appendChild(postLink);

    postsContainer.appendChild(postElement);
  });
}

fetchPosts();
