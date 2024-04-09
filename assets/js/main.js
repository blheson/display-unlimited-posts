// Function to retrieve WordPress posts
async function UnlimitedPostPluginretrieveWordPressPosts({ page = 1, perPage = 15, searchQuery = '', postType = 'post', orderBy = 'date', order = 'desc' }) {
    if(page< 2){
        console.log('[ UnlimitedPostPluginretrieveWordPressPosts ] Invalid error Posts')
        return;
    }
    // Define the base URL of the WordPress site and the endpoint for posts
    var baseURL = `${window.location.origin}/wp-json/wp/v2/posts`;

    // varruct the query string with optional parameters

    let queryParams = `?page=${page}&per_page=${perPage}&type=${postType}&orderby=${orderBy}&order=${order}&meta_key=_thumbnail_id`;
    if (searchQuery !== '') {
        queryParams += `&search=${encodeURIComponent(searchQuery)}`;
    }

    // varruct the complete URL
    var url = `${baseURL}${queryParams}`;

    try {
        // Send a GET request to the WordPress REST API endpoint
        var response = await fetch(url);

        // Check if the request was successful (status code 200)
        if (response.ok) {
            // Parse the JSON response
            var posts = await response.json();

            // Return the retrieved posts
            return posts;
        } else {
            // If the request was not successful, throw an error
            throw new Error(`Failed to retrieve WordPress posts. Status: ${response.status}`);
        }
    } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error retrieving WordPress posts:', error.message);
        return null;
    }
}


async function UnlimitedPostPluginInit() {

    var buttonElement = document.querySelector('#unlimited_posts_display_posts_shortcode button');

    if (!buttonElement) {
        setTimeout(UnlimitedPostPluginInit, 1000)
        return
    }



}

async function UnlimitedPostPluginInitLoadMore() {
    var buttonElement = document.querySelector('#unlimited_posts_display_posts_shortcode button');

    var buttonString = buttonElement.dataset;
    
    if(buttonString.disabled){
        console.log('End of list, button is disabled')
        return
    }
    if(buttonString.loading === '1'){
        console.log(' button is loading')
        return
    }
    buttonElement.dataset.loading = '1'
    buttonElement.textContent = 'fetching...'
    // Example usage:
    UnlimitedPostPluginretrieveWordPressPosts({ page:  buttonString.page, perPage: 12 })
        .then(posts => {
            if(!posts ){
                UnlimitedPostPluginPostDeactivateButton();
                return;
                    }
            buttonElement.dataset.loading = false
            buttonElement.textContent = 'Load more'
            if (posts) {
                // Handle retrieved posts
             
                var template = document.createDocumentFragment();
                if (Array.isArray(posts)) {
             
                    if(posts.length < buttonString.per_page) {
                        UnlimitedPostPluginPostDeactivateButton();
                    }
                    posts.forEach(post => {
                        var postcard = UnlimitedPostPluginPostCardSkeleton(post);

                        template.appendChild(postcard)
                    })
                    var arrayCardElement = document.querySelector('#unlimited_posts_display_posts_shortcode .unlimited_posts-post-card');

                    arrayCardElement.appendChild(template);
                    buttonElement.dataset.page = buttonString.page + 1
                }
            } else {
                // Handle case where posts couldn't be retrieved
                console.log('Failed to retrieve WordPress posts.');
            }
        })
        .catch(error => {
            buttonElement.dataset.loading = '0'
            buttonElement.textContent = 'Load more'
 
            if(buttonString.page > 2 ){
        UnlimitedPostPluginPostDeactivateButton();
            }
            console.error('Error:', error);
        }).finally(() => {
    buttonElement.dataset.loading = '0'
    buttonElement.textContent = 'Load more'

        });

}

function UnlimitedPostPluginPostDeactivateButton() {
    console.log("UnlimitedPostPluginPostDeactivateButton")
    var buttonElement = document.querySelector('#unlimited_posts_display_posts_shortcode button');

    buttonElement.style.opacity = 0.5;
    buttonElement.dataset.disabled = true;
}
function UnlimitedPostPluginPostCardSkeleton(post) {
    // var wrapper = document.createElement('div');
    // wrapper.classList.add('unlimited-post-listing-item');

    // //create image link
    // var image_link = document.createElement('a');
    // image_link.classList.add('unlimited-post-listing-item-link');

    // //create img
    // var img = document.createElement('img');
    // img.classList.add('unlimited-post-listing-item-image');
    // img.width = '300';
    // img.height = '150';
    // img.alt = '';
    // image_link.appendChild(img);

    // //create link
    // var title = document.createElement('a');
    // title.classList.add('unlimited-post-listing-item-title');



    // //create date
    // var date = document.createElement('div');
    // date.classList.add('unlimited-post-listing-item-date');
    // var date_text = document.createElement('span');
    // date.appendChild(date_text)

    // //Wrappe append
    // wrapper.appendChild(image_link)
    // wrapper.appendChild(title)
    // wrapper.appendChild(date)
    if (!post.id) return;
    if (!document.querySelector('.unlimited_posts-post-card .listing-item')) {
        console.error('Node clone error');
        return;
    }
    var wrapper = document.querySelector('.unlimited_posts-post-card .listing-item').cloneNode(true);
    var imagelink = wrapper.querySelector('.unlimited-post-image_link');
    imagelink.href = post.link;
    imagelink.querySelector('img').src = post.attachment_url_image;

    var title = wrapper.querySelector('.unlimited-post-listing-item-title');
    title.href = post.link;
    title.textContent = post.title.rendered;

    const dateString = post.date;
    const dateObj = new Date(dateString);

    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('en-US', options);
    var date = wrapper.querySelector('.unlimited-post-listing-item-date');
    date.textContent = formattedDate;

    return wrapper;

}
console.log('[ v1.0.3 ]', 'UnlimitedPostPluginInitLoadMore');

document.addEventListener('DOMContentLoaded', UnlimitedPostPluginInit)
