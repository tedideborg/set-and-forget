var ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/tedideborg/set-and-forget.git', // Update to point to your repository
        user: {
            name: 'Ted Ideborg', // update to use your name
            email: 't.ideborg@gmail.com', // Update to use your email
        },
    },
    () => {
        console.log('Deploy Complete!');
    },
);
