const https = require('https');

const base_test_url = 'gitlab.pavlovia.org/api/v4' //'gitlab.pavlovia.org/juqi/api/v4';
const test_access_token = 'wmJNxtQaGzHC4CSip4RV';

export const listAllProjects = ({hostname=base_test_url, accessToken=test_access_token}={}) => {
    return new Promise((resolve, reject) => {
        let getOptions = {
            hostname,
            // path: '/users?username=juqi',
            // path: '/projects/2403/repository/files/get.test.txt?ref=master',
            path: '/projects/2403/repository/tree?recursive=true&per_page=3&page=2',
            method: 'GET',
            headers: {
                'Private-Token': accessToken
            }
        }

        const req = https.request(getOptions, (res) => {
            res.on('data', (d) => {
                resolve(d);
            });
            console.log(res.headers['x-total-pages'])
        })

        req.on('error', (e) => {
            reject(e);
        });

        req.end();
    })
}

export const createProjectFor = ({hostname=base_test_url, accessToken=test_access_token}={}) => {
    return new Promise((resolve, reject) => {
        let body = JSON.stringify({
                // user_id: '556',
                // name: 'api_test_project4',
                // visibility: 'public',
                // id: '2403',

                // file_path: "app/post.test.txt",
                // content: 'pt update',
                branch: 'master',
                actions: [
                    {
                      "action": "delete",
                      "file_path": "foo",
                      "content": "some content"
                    },
                ],
                commit_message: 'test commit create/update'
            }),
            postOptions = {
                hostname,
                // path: '/projects/2403/repository/files/app%2Fapp2%2Fpost.test.txt',
                // path: '/projects',
                path: '/projects/2403/repository/commits',
                method: "POST",
                headers: {
                    'Private-Token': accessToken,
                    'Content-Type': 'application/json'
                }
            };

        const req = https.request(postOptions, (res) => {
            res.on('data', (d) => {
                resolve(d);
            });
        })

        req.on('error', (e) => {
            reject(e);
        });

        req.write(body);
        req.end();
    })
}