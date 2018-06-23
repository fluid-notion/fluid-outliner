const path = require('path');
const ghpages = require('gh-pages');

ghpages.publish(path.join(__dirname, '../dist-webpack'), function(err) {
    if (err) {
        console.error('Failed to publish');
    } else {
        console.log('Success !');
    }
});
