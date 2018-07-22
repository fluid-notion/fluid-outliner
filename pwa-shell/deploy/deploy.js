const path = require('path');
const ghpages = require('gh-pages');

if (process.env.NODE_ENV !== "production") {
    throw new Error("Attempted to deploy without setting production environment");
}

ghpages.publish(path.join(__dirname, '../dist'), function(err) {
    if (err) {
        console.error(err);
        console.error('Failed to deploy');
    } else {
        console.log('Success !');
    }
});
