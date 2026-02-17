
const http = require('http');

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

const req = http.request({
    hostname: 'localhost',
    path: '/v2maiyah/graphql',
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
