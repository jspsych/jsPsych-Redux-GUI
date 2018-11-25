const https = require('https');

const GITLAB_HOSTNAME = 'gitlab.pavlovia.org/api/v4';

const open_get_request = ({options}) => {
    return new Promise((resolve, reject) => {
        const getOptions = {
            method: 'GET',
            ...options,
        };
        const req = https.request(getOptions, (res) => {
            res.on('data', (d) => {
                resolve(d);
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.end();
    });
}

const open_post_request = ({options, body}) => {
    return new Promise((resolve, reject) => {
        const postOptions = {
            method: "POST",
            ...options,
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
    });
}

const __Decoder = new TextDecoder("utf-8");
const decode = (d) => __Decoder.decode(d);

export default class PavloviaConnector {
    // returns gitlab api response
    // user_id is data.id
    static async get_userId({username, access_token}) {
        const options = {
            hostname: GITLAB_HOSTNAME,
            path: `/users?username=${username}`,
            headers: {
                'Private-Token': access_token
            }
        }
        try {
            const response = decode(await open_get_request({options}));
            const data = JSON.parse(response);
            return data;
        } catch (e) {
            return Promise.reject(e);
        }
    }

    // returns gitlab api response
    // project_id is data.id
    static async create_project({username, access_token, project_info}) {
        const options = {
            hostname: GITLAB_HOSTNAME,
            path: '/projects',
            headers: {
                'Private-Token': access_token
                'Content-Type': 'application/json'
            }
        };
        const body = {
            visibility: 'public',
            name: 'jsPsych_Project',
            ...project_info,
        };
        try {
            const response = decode(await open_post_request({options, body}));
            const data = JSON.parse(response);
            return data;
        } catch (e) {
            return Promise.reject(e);
        }
    }

    static async deploy({project_id, access_token, actions}) {
        const options = {
            hostname: GITLAB_HOSTNAME,
            path: `/projects/${project_id}/repository/commits`,
            headers: {
                'Private-Token': access_token
                'Content-Type': 'application/json'
            }
        };
        const body = {
            branch: 'master',
            commit_message: 'deployment updates from builder.jspsych.org',
            actions,
        };
        try {
            const response = decode(await open_post_request({options, body}));
            const data = JSON.parse(response);
            return data;
        } catch (e) {
            return Promise.reject(e);
        }
    }
}