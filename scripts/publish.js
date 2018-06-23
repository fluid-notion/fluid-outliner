const path = require('path');
const ghpages = require('gh-pages');

if (process.env.NODE_ENV !== "production") {
    throw new Error("Attempted to publish without setting production environment");
}

ghpages.publish(path.join(__dirname, '../dist-webpack'), function(err) {
    if (err) {
        console.error('Failed to publish');
    } else {
        console.log('Success !');
    }
});
