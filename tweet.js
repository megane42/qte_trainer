function tweet(text, url, hashtags) {
    window.open(
        'https://twitter.com/intent/tweet'
            + '?text='     + encodeURIComponent(text)
            + '&url='      + encodeURIComponent(url)
            + '&hashtags=' + encodeURIComponent(hashtags)
    );
}
