// import reddit from './redditApi'

const searchForm = document.getElementById('search-form')
const searchInput = document.getElementById('search-input')

searchForm.addEventListener('submit', (e) => {
    // get the search term
    const searchTerm = searchInput.value;

    //get sort
    const sortBy = document.querySelector('input[name="sortby"]:checked').value

    //get the limit
    const searchLimit = document.getElementById('limit').value

    //check input
    if (searchTerm === "") {
        //show message
        showMessage('Please add a search term', 'alert-danger')
    }

    //clear input
    searchInput.value = ""

    //search reddit
    search(searchTerm, searchLimit, sortBy)
        .then(results => {
            let output = '<div class="card-columns">'

            //looping through posts
            results.forEach(post => {
                //check for image existence
                let image = post.preview ? post.preview.images[0].source.url : 'https://cdn.comparitech.com/wp-content/uploads/2017/08/reddit-1.jpg'
                output += `
                <div class="card">
                    <img class="card-img-top" src="${image}" alt="Card image cap">
                    <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text">${truncateText(post.selftext, 100)}</p>
                        <a href="${post.url}" target="_blank" class="btn btn-primary">Read More</a>
                        <hr>
                        <span class="badge badge-secondary">Subreddit: ${post.subreddit}</span>
                        <span class="badge badge-dark">Score: ${post.score}</span>
                    </div>
                </div>
                `
            })
            output += '</div>'
            document.getElementById('results').innerHTML = output
        })

    e.preventDefault()
})

//show alert message

function showMessage(message, className) {
    //create a div
    const div = document.createElement('div')

    //add classes tio that div
    div.className = `alert ${className}`

    //add the text
    div.appendChild(document.createTextNode(message))

    //get the parent container
    const searchContainer = document.getElementById('search-container')

    //get search
    const search = document.getElementById('search')

    //insert the message
    searchContainer.insertBefore(div, search)

    //timeout alert
    setTimeout(() => {
        document.querySelector('.alert').remove()
    }, 3000)
}

//truncate text
function truncateText(str, limit) {
    const shortened = str.indexOf(' ', limit)
    if (shortened == -1) return str
    return str.substring(0, shortened)
}

let search = (searchTerm, searchLimit, sortBy) => {
    return fetch(`http://www.reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${searchLimit}`)
        .then(res => res.json())
        .then(data => data.data.children.map(data => data.data))
        .catch(err => console.log(err))
}