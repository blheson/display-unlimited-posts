// Function to retrieve WordPress posts
async function UnlimitedPostPluginretrieveWordPressPosts(page = 1, perPage = 10, searchQuery = '') {
    // Define the base URL of the WordPress site and the endpoint for posts
    const baseURL = `${window.location.host}/wp-json/wp/v2/posts`;

    // Construct the query string with optional parameters
    let queryParams = `?page=${page}&per_page=${perPage}`;
    if (searchQuery !== '') {
        queryParams += `&search=${encodeURIComponent(searchQuery)}`;
    }

    // Construct the complete URL
    const url = `${baseURL}${queryParams}`;

    try {
        // Send a GET request to the WordPress REST API endpoint
        const response = await fetch(url);

        // Check if the request was successful (status code 200)
        if (response.ok) {
            // Parse the JSON response
            const posts = await response.json();

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
    console.log('load pagination')
    const buttonElement = document.querySelector('#unlimited_posts_display_posts_shortcode button');

    if(!buttonElement){
        setTimeout(UnlimitedPostPluginInit,1000)
        return 
    }
    buttonElement.dataset
    // Example usage:
    UnlimitedPostPluginretrieveWordPressPosts(1, 10, '')
        .then(posts => {
            if (posts) {
                // Handle retrieved posts
                console.log(posts);
            } else {
                // Handle case where posts couldn't be retrieved
                console.log('Failed to retrieve WordPress posts.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

async function UnlimitedPostPluginInitLoadMore(){
    const buttonElement = document.querySelector('#unlimited_posts_display_posts_shortcode button');

}