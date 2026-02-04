
const https = require('https');

const query = JSON.stringify({
    query: `
    query GetGlobalNav {
      page(id: "/", idType: URI) {
        globalNavigationManager {
          desktopMenuItems {
            label
            url
            menuItems: subMenuItems {
                label
                url
            }
          }
           mobileDrawerItems {
            label
            url
             menuItems: subMenuItems {
                label
                url
            }
          }
          bottomNavItems {
            label
            url
            icon
          }
        }
      }
    }
  `
});

const req = https.request({
    hostname: 'assets.mymaiyah.id',
    path: '/graphql',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': query.length
    }
}, res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log(data));
});

req.on('error', error => {
    console.error('Error:', error);
});

req.write(query);
req.end();
